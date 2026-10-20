// Admin role = a document at admins/{uid}. firestore.rules is the authority:
// these checks only drive the UI, every read/write is re-checked server side.
// The first admin is bootstrapped with the Admin SDK (scripts/set-admin.mjs).

import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

export class AdminManager {
  // Check if the signed-in user is admin (by uid, never by email)
  static async isCurrentUserAdmin() {
    const user = auth.currentUser
    if (!user) return false
    try {
      return (await getDoc(doc(db, 'admins', user.uid))).exists()
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Grant or revoke admin. Rules allow this only for existing admins, and never self-revoke.
  static async setAdminRole(email, isAdmin) {
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Must be authenticated')
    }

    const usersSnapshot = await getDocs(collection(db, 'users'))
    const target = usersSnapshot.docs.find(
      (d) => d.data().userInformation?.email?.toLowerCase() === email.toLowerCase()
    )
    if (!target) {
      throw new Error('User not found with this email')
    }
    if (!isAdmin && target.id === currentUser.uid) {
      throw new Error('You cannot remove your own admin rights')
    }

    const adminRef = doc(db, 'admins', target.id)
    if (isAdmin) {
      await setDoc(adminRef, {
        email: email.toLowerCase(),
        grantedBy: currentUser.uid,
        grantedAt: serverTimestamp()
      })
    } else {
      await deleteDoc(adminRef)
    }

    return {
      success: true,
      message: `User ${email} ${isAdmin ? 'granted' : 'removed'} admin privileges`,
      email: email,
      isAdmin: isAdmin
    }
  }

  // Get all users with admin status (rules reject this for non-admins)
  static async getAllUsers() {
    const [usersSnapshot, adminsSnapshot] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'admins'))
    ])
    const adminIds = new Set(adminsSnapshot.docs.map((d) => d.id))
    const users = []

    usersSnapshot.forEach((doc) => {
      const userData = doc.data()

      const user = {
        id: doc.id,
        email: userData.userInformation?.email || 'No email',
        firstName: userData.userInformation?.firstName || 'Unknown',
        middleName: userData.userInformation?.middleName || '',
        lastName: userData.userInformation?.lastName || userData.userInformation?.surname || 'Unknown',
        surname: userData.userInformation?.surname || userData.userInformation?.lastName || 'Unknown',
        createdAt: userData.userInformation?.createdAt || null,
        isAdmin: adminIds.has(doc.id),
        lastLoginDate: userData.userInformation?.lastLoginDate || null,
        hasHealthInfo: !!(userData.healthInformation),
        formCompletionStatus: {
          personalInfo: !!(userData.userInformation?.firstName && (userData.userInformation?.surname || userData.userInformation?.lastName)),
          healthInfo: !!(userData.healthInformation),
          fullCompletion: !!(userData.userInformation?.firstName && userData.healthInformation)
        }
      }

      users.push(user)
    })

    return {
      success: true,
      users: users,
      totalCount: users.length,
      adminCount: users.filter(u => u.isAdmin).length
    }
  }
}
