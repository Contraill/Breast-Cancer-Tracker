// End-to-end smoke tests of the app's auth + data flows against the Auth and Firestore emulators.
// Run with `npm test` (the emulators are started by firebase emulators:exec).
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { after, before, test } from 'node:test'
import { initializeApp, deleteApp } from 'firebase/app'
import {
  getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  updatePassword, updateEmail, EmailAuthProvider, reauthenticateWithCredential
} from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, doc, getDoc, setDoc, getDocs, collection, terminate } from 'firebase/firestore'
import { buildProfilePayload } from '../src/utils/profilePayload.js'
import { fakeForm } from './fakeForm.mjs'

const projectId = process.env.GCLOUD_PROJECT || 'demo-bct'
const [fsHost, fsPort] = (process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080').split(':')
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099'

let app, auth, db
const run = Date.now()
const userEmail = `smoke-${run}@example.test`
const adminEmail = `smoke-admin-${run}@example.test`
const PASSWORD = 'Passw0rd1'

before(() => {
  app = initializeApp({ apiKey: 'demo-key', projectId, authDomain: `${projectId}.firebaseapp.com` })
  auth = getAuth(app)
  connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true })
  db = getFirestore(app)
  connectFirestoreEmulator(db, fsHost, Number(fsPort))
})
after(async () => {
  await terminate(db)
  await deleteApp(app)
})

test('register and save own health record', async () => {
  const { user } = await createUserWithEmailAndPassword(auth, userEmail, PASSWORD)
  await setDoc(doc(db, 'users', user.uid), buildProfilePayload(fakeForm(), user.email))
  const snap = await getDoc(doc(db, 'users', user.uid))
  assert.equal(snap.data().userInformation.email, userEmail)
  assert.equal(snap.data().userInformation.dob, '1980-01-01')
})

test('login and update saved data', async () => {
  await signOut(auth)
  const { user } = await signInWithEmailAndPassword(auth, userEmail, PASSWORD)
  await setDoc(doc(db, 'users', user.uid), buildProfilePayload(fakeForm({ smokingStatus: 'Ex-Smoker', yearsStoppedSmoking: 2.5 }), user.email))
  const snap = await getDoc(doc(db, 'users', user.uid))
  assert.equal(snap.data().healthInformation.smoking.yearsStoppedSmoking, 2.5)
})

test('profile update: change password and email, then save again', async () => {
  const user = auth.currentUser
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(userEmail, PASSWORD))
  await updatePassword(user, 'NewPassw0rd2')
  const newEmail = `smoke-new-${run}@example.test`
  await updateEmail(user, newEmail)
  await setDoc(doc(db, 'users', user.uid), buildProfilePayload(fakeForm(), auth.currentUser.email))
  await signOut(auth)
  const { user: again } = await signInWithEmailAndPassword(auth, newEmail, 'NewPassw0rd2')
  assert.equal((await getDoc(doc(db, 'users', again.uid))).data().userInformation.email, newEmail)
})

test('regular user cannot list users or become admin', async () => {
  await assert.rejects(getDocs(collection(db, 'users')), /permission/i)
  await assert.rejects(
    setDoc(doc(db, 'admins', auth.currentUser.uid), { email: 'x', grantedBy: auth.currentUser.uid, grantedAt: new Date() }),
    /permission/i
  )
})

test('admin bootstrapped via Admin SDK script can open the admin data', async () => {
  await signOut(auth)
  await createUserWithEmailAndPassword(auth, adminEmail, PASSWORD)
  execFileSync('node', ['scripts/set-admin.mjs', 'grant', adminEmail], {
    env: { ...process.env, GCLOUD_PROJECT: projectId }, stdio: 'pipe'
  })
  assert.ok((await getDoc(doc(db, 'admins', auth.currentUser.uid))).exists())
  const users = await getDocs(collection(db, 'users'))
  assert.ok(users.docs.some((d) => d.data().userInformation.email.startsWith('smoke-new-')))
})
