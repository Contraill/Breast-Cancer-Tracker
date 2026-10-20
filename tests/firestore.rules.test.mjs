// Security tests for firestore.rules. Run with `npm run test:rules` (starts the Firestore emulator).
import { readFileSync } from 'node:fs'
import { after, before, beforeEach, describe, test } from 'node:test'
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc, getDocs, collection, serverTimestamp } from 'firebase/firestore'
import { buildProfilePayload } from '../src/utils/profilePayload.js'
import { fakeForm } from './fakeForm.mjs'

const ALICE = { uid: 'alice', email: 'alice@example.test' }
const BOB = { uid: 'bob', email: 'bob@example.test' }
const ADMIN = { uid: 'admin', email: 'admin@example.test' }

let env
const as = (u) => env.authenticatedContext(u.uid, { email: u.email }).firestore()
const anon = () => env.unauthenticatedContext().firestore()
const profile = (u) => buildProfilePayload(fakeForm(), u.email)

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-bct',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') }
  })
})
after(() => env.cleanup())

beforeEach(async () => {
  await env.clearFirestore()
  // Seed bypassing rules: one admin, alice's existing record
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore()
    await setDoc(doc(db, 'admins', ADMIN.uid), { email: ADMIN.email, grantedBy: 'admin-sdk', grantedAt: new Date() })
    await setDoc(doc(db, 'users', ALICE.uid), profile(ALICE))
  })
})

describe('unauthenticated', () => {
  test('cannot read or write health records', async () => {
    await assertFails(getDoc(doc(anon(), 'users', ALICE.uid)))
    await assertFails(getDocs(collection(anon(), 'users')))
    await assertFails(setDoc(doc(anon(), 'users', 'x'), profile({ email: 'x@example.test' })))
  })
  test('cannot read the admin list', async () => {
    await assertFails(getDocs(collection(anon(), 'admins')))
  })
  test('can read but not write app settings', async () => {
    await assertSucceeds(getDoc(doc(anon(), 'appSettings', 'main')))
    await assertFails(setDoc(doc(anon(), 'appSettings', 'main'), { allowRegistration: true }))
  })
})

describe('regular user', () => {
  test('can create, read, update and delete own record', async () => {
    const db = as(BOB)
    await assertSucceeds(setDoc(doc(db, 'users', BOB.uid), profile(BOB)))
    await assertSucceeds(getDoc(doc(db, 'users', BOB.uid)))
    await assertSucceeds(setDoc(doc(db, 'users', BOB.uid), buildProfilePayload(fakeForm({ city: 'Elsewhere' }), BOB.email)))
    await assertSucceeds(deleteDoc(doc(db, 'users', BOB.uid)))
  })

  test("cannot read, list or modify another user's record", async () => {
    const db = as(BOB)
    await assertFails(getDoc(doc(db, 'users', ALICE.uid)))
    await assertFails(getDocs(collection(db, 'users')))
    await assertFails(setDoc(doc(db, 'users', ALICE.uid), profile(BOB)))
    await assertFails(updateDoc(doc(db, 'users', ALICE.uid), { 'userInformation.firstName': 'X' }))
    await assertFails(deleteDoc(doc(db, 'users', ALICE.uid)))
  })

  test('cannot store a record under someone else\'s email', async () => {
    await assertFails(setDoc(doc(as(BOB), 'users', BOB.uid), profile(ALICE)))
  })

  test('cannot smuggle role fields into own record', async () => {
    const db = as(ALICE)
    const withFlag = profile(ALICE)
    withFlag.userInformation.isAdmin = true
    await assertFails(setDoc(doc(db, 'users', ALICE.uid), withFlag))
    await assertFails(setDoc(doc(db, 'users', ALICE.uid), { ...profile(ALICE), role: 'admin' }))
    await assertFails(updateDoc(doc(db, 'users', ALICE.uid), { 'userInformation.isAdmin': true }))
  })

  test('cannot make themselves (or anyone) admin', async () => {
    const db = as(ALICE)
    const grant = { email: ALICE.email, grantedBy: ALICE.uid, grantedAt: serverTimestamp() }
    await assertFails(setDoc(doc(db, 'admins', ALICE.uid), grant))
    await assertFails(setDoc(doc(db, 'admins', BOB.uid), { ...grant, email: BOB.email }))
    await assertFails(deleteDoc(doc(db, 'admins', ADMIN.uid)))
  })

  test('can check own admin status but not list admins', async () => {
    const db = as(ALICE)
    await assertSucceeds(getDoc(doc(db, 'admins', ALICE.uid)))
    await assertFails(getDoc(doc(db, 'admins', ADMIN.uid)))
    await assertFails(getDocs(collection(db, 'admins')))
  })

  test('cannot change app settings', async () => {
    await assertFails(setDoc(doc(as(ALICE), 'appSettings', 'main'), { allowRegistration: false, updatedBy: ALICE.uid }))
  })
})

describe('admin', () => {
  test('can read all records and the admin list', async () => {
    const db = as(ADMIN)
    await assertSucceeds(getDocs(collection(db, 'users')))
    await assertSucceeds(getDoc(doc(db, 'users', ALICE.uid)))
    await assertSucceeds(getDocs(collection(db, 'admins')))
  })

  test("cannot modify a user's health record", async () => {
    const db = as(ADMIN)
    await assertFails(updateDoc(doc(db, 'users', ALICE.uid), { 'userInformation.firstName': 'X' }))
    await assertFails(deleteDoc(doc(db, 'users', ALICE.uid)))
  })

  test('can grant and revoke admin for others, with an honest grantedBy', async () => {
    const db = as(ADMIN)
    const ref = doc(db, 'admins', ALICE.uid)
    await assertFails(setDoc(ref, { email: ALICE.email, grantedBy: 'someone-else', grantedAt: serverTimestamp() }))
    await assertSucceeds(setDoc(ref, { email: ALICE.email, grantedBy: ADMIN.uid, grantedAt: serverTimestamp() }))
    await assertFails(updateDoc(ref, { email: 'other@example.test' }))
    await assertSucceeds(deleteDoc(ref))
  })

  test('cannot revoke own admin (no lock-out)', async () => {
    await assertFails(deleteDoc(doc(as(ADMIN), 'admins', ADMIN.uid)))
  })

  test('can update app settings only with known keys and own uid', async () => {
    const db = as(ADMIN)
    const ref = doc(db, 'appSettings', 'main')
    const settings = { allowRegistration: false, dataRetentionPeriod: '730', emailNotifications: true, lastUpdated: 'now' }
    await assertSucceeds(setDoc(ref, { ...settings, updatedBy: ADMIN.uid }, { merge: true }))
    await assertFails(setDoc(ref, { ...settings, updatedBy: ALICE.uid }, { merge: true }))
    await assertFails(setDoc(ref, { ...settings, updatedBy: ADMIN.uid, extra: 1 }, { merge: true }))
  })
})
