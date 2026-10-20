// Trusted admin assignment via the Admin SDK (bypasses firestore.rules).
// Usage: npm run admin:grant -- <email>    |    npm run admin:revoke -- <email>
// Credentials: GOOGLE_APPLICATION_CREDENTIALS=<service-account.json> or `gcloud auth application-default login`.
// Against the emulators: set FIRESTORE_EMULATOR_HOST and FIREBASE_AUTH_EMULATOR_HOST.
import { readFileSync } from 'node:fs'
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

const [action, email] = process.argv.slice(2)
if (!['grant', 'revoke'].includes(action) || !email) {
  console.error('Usage: node scripts/set-admin.mjs <grant|revoke> <email>')
  process.exit(1)
}

const projectId = process.env.GCLOUD_PROJECT ||
  JSON.parse(readFileSync(new URL('../.firebaserc', import.meta.url))).projects.default
const emulated = !!process.env.FIRESTORE_EMULATOR_HOST
initializeApp(emulated ? { projectId } : { projectId, credential: applicationDefault() })

const user = await getAuth().getUserByEmail(email)
const ref = getFirestore().doc(`admins/${user.uid}`)
if (action === 'grant') {
  await ref.set({ email: email.toLowerCase(), grantedBy: 'admin-sdk', grantedAt: FieldValue.serverTimestamp() })
} else {
  await ref.delete()
}
console.log(`${action === 'grant' ? 'Granted' : 'Revoked'} admin for ${email} (uid ${user.uid}) in ${projectId}`)
