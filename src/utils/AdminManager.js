// Firebase Admin Management - Frontend Only Solution
// This is a free alternative that doesn't require Cloud Functions

import { doc, updateDoc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase.js'

export class AdminManager {
  // Hardcoded admin emails for initial setup - These will become admin automatically when they register
  static INITIAL_ADMINS = [
    'i.canoztozlu@gmail.com',  // Your email
    // Add more initial admin emails here if needed
  ]

  // Super admin environment variable check (for emergency access)
  static isSuperAdmin(email) {
    // Check if this email is in environment variables or config
    const superAdminEmails = import.meta.env.VITE_SUPER_ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
    const isInEnv = superAdminEmails.includes(email.toLowerCase());
    const isInHardcoded = this.INITIAL_ADMINS.includes(email.toLowerCase());
    
    if (isInEnv) {
      return { isAdmin: true, reason: 'super_admin' };
    }
    
    return isInEnv || isInHardcoded;
  }

  // Check if emergency admin mode is enabled
  static isEmergencyModeEnabled() {
    return import.meta.env.VITE_EMERGENCY_ADMIN_ENABLED === 'true';
  }

  // Emergency admin creation - if no admins exist, first user becomes admin
  static async checkEmergencyAdmin() {
    try {
      // Get all users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'))
      let hasAnyAdmin = false
      let totalUsers = 0

      usersSnapshot.forEach((doc) => {
        const userData = doc.data()
        totalUsers++
        
        // Check if user is admin (initial admin or Firestore admin)
        const isAdmin = this.INITIAL_ADMINS.includes(userData.userInformation?.email?.toLowerCase()) || 
                       userData.userInformation?.isAdmin === true
        
        if (isAdmin) {
          hasAnyAdmin = true
        }
      })

      // Also check if there are hardcoded admins (super admins) - they count as admins too
      const hasHardcodedAdmins = this.INITIAL_ADMINS.length > 0;
      
      console.log('Emergency check - DB admins:', hasAnyAdmin, 'Hardcoded admins:', hasHardcodedAdmins);

      // If no admins exist (neither in DB nor hardcoded) and there are users, emergency admin mode
      if (!hasAnyAdmin && !hasHardcodedAdmins && totalUsers > 0) {
        console.warn('🚨 EMERGENCY: No admins found in system!')
        return {
          emergencyMode: true,
          message: 'No administrators found. First logged-in user will become admin.'
        }
      }

      return { emergencyMode: false }
    } catch (error) {
      console.error('Error checking emergency admin:', error)
      return { emergencyMode: false }
    }
  }

  // Check if user is admin (frontend check)
  static async isUserAdmin(email) {
    try {
      console.log('🔍 Admin check initiated');
      
      // First check if it's a super admin
      if (this.isSuperAdmin(email)) {
        console.log('✅ User is super admin');
        return true
      }

      // Check for emergency admin scenario
      const emergencyCheck = await this.checkEmergencyAdmin()
      if (emergencyCheck.emergencyMode && this.isEmergencyModeEnabled()) {
        // In emergency mode, current logged-in user becomes admin
        const currentUser = auth.currentUser
        if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
          console.log('🚨 Emergency admin access granted');
          // Immediately make this user admin
          await this.makeEmergencyAdmin(currentUser.uid, email)
          return true
        }
      }

      // Check if user is in initial admins list
      if (this.INITIAL_ADMINS.includes(email.toLowerCase())) {
        console.log('✅ User is in initial admins list');
        return true
      }

      // Check Firestore for admin status by email (not just current user)
      const usersSnapshot = await getDocs(collection(db, 'users'))
      let isAdminInDb = false
      
      usersSnapshot.forEach((doc) => {
        const userData = doc.data()
        if (userData.userInformation?.email?.toLowerCase() === email.toLowerCase()) {
          const adminStatus = userData.userInformation?.isAdmin === true
          console.log('🔍 User found in DB, admin status:', adminStatus);
          isAdminInDb = adminStatus
        }
      })

      console.log('🔍 Final admin check result:', isAdminInDb);
      return isAdminInDb
    } catch (error) {
      console.error('Error checking admin status:', error)
      return false
    }
  }

  // Emergency admin creation
  static async makeEmergencyAdmin(uid, email) {
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, {
        'userInformation.isAdmin': true,
        'userInformation.emergencyAdminAt': new Date(),
        'userInformation.adminType': 'emergency'
      })

      // Also create admin record for Firestore rules
      const adminRef = doc(db, 'admins', uid)
      await setDoc(adminRef, {
        email: email.toLowerCase(),
        assignedAt: new Date(),
        type: 'emergency'
      })

      console.log('✅ Emergency admin created successfully');
    } catch (error) {
      console.error('Error creating emergency admin:', error)
    }
  }

  // Set admin role in Firestore only (frontend approach)
  static async setAdminRole(email, isAdmin) {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Must be authenticated')
      }

      // Check if current user is admin
      const currentUserIsAdmin = await this.isUserAdmin(currentUser.email)
      if (!currentUserIsAdmin) {
        throw new Error('Only admins can modify admin roles')
      }

      // Find target user by email
      const usersSnapshot = await getDocs(collection(db, 'users'))
      let targetUserId = null
      let targetUserDoc = null

      usersSnapshot.forEach((doc) => {
        const userData = doc.data()
        if (userData.userInformation?.email?.toLowerCase() === email.toLowerCase()) {
          targetUserId = doc.id
          targetUserDoc = userData
        }
      })

      if (!targetUserId) {
        throw new Error('User not found with this email')
      }

      // Update Firestore document
      const userRef = doc(db, 'users', targetUserId)
      await updateDoc(userRef, {
        'userInformation.isAdmin': isAdmin,
        'userInformation.adminAssignedAt': new Date(),
        'userInformation.adminAssignedBy': currentUser.uid
      })

      // Also update admins collection for Firestore rules
      const adminRef = doc(db, 'admins', targetUserId)
      if (isAdmin) {
        await setDoc(adminRef, {
          email: email.toLowerCase(),
          assignedAt: new Date(),
          assignedBy: currentUser.uid,
          type: 'manual'
        })
      } else {
        // Remove from admins collection
        try {
          await deleteDoc(adminRef)
        } catch (deleteError) {
          // Admin record might not exist, that's okay
          console.log('Admin record not found for deletion:', deleteError)
        }
      }

      return {
        success: true,
        message: `User ${email} ${isAdmin ? 'granted' : 'removed'} admin privileges`,
        email: email,
        isAdmin: isAdmin
      }

    } catch (error) {
      console.error('Error setting admin role:', error)
      throw error
    }
  }

  // Get all users with admin status
  static async getAllUsers() {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('Must be authenticated')
      }

      // Check if current user is admin
      const currentUserIsAdmin = await this.isUserAdmin(currentUser.email)
      if (!currentUserIsAdmin) {
        throw new Error('Only admins can view all users')
      }

      // Get all users from Firestore
      const usersSnapshot = await getDocs(collection(db, 'users'))
      const users = []

      usersSnapshot.forEach((doc) => {
        const userData = doc.data()
        
        // Check if user is admin (initial admin or Firestore admin)
        const isAdmin = this.INITIAL_ADMINS.includes(userData.userInformation?.email?.toLowerCase()) || 
                       userData.userInformation?.isAdmin === true

        const user = {
          id: doc.id,
          email: userData.userInformation?.email || 'No email',
          firstName: userData.userInformation?.firstName || 'Unknown',
          middleName: userData.userInformation?.middleName || '',
          lastName: userData.userInformation?.lastName || userData.userInformation?.surname || 'Unknown',
          surname: userData.userInformation?.surname || userData.userInformation?.lastName || 'Unknown',
          createdAt: userData.userInformation?.createdAt || null,
          isAdmin: isAdmin,
          lastLoginDate: userData.userInformation?.lastLoginDate || null,
          hasHealthInfo: !!(userData.healthInformation),
          formCompletionStatus: {
            personalInfo: !!(userData.userInformation?.firstName && userData.userInformation?.lastName),
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

    } catch (error) {
      console.error('Error getting all users:', error)
      throw error
    }
  }

  // Initialize admin status for current user if they're in initial admins
  static async initializeAdminStatus() {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) return

      const email = currentUser.email
      if (this.INITIAL_ADMINS.includes(email.toLowerCase())) {
        const userRef = doc(db, 'users', currentUser.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          if (!userData.userInformation?.isAdmin) {
            await updateDoc(userRef, {
              'userInformation.isAdmin': true,
              'userInformation.adminInitializedAt': new Date()
            })

            // Also create admin record for Firestore rules
            const adminRef = doc(db, 'admins', currentUser.uid)
            await setDoc(adminRef, {
              email: email.toLowerCase(),
              assignedAt: new Date(),
              type: 'initial'
            })

            console.log('✅ Admin status initialized successfully');
          }
        }
      }
    } catch (error) {
      console.error('Error initializing admin status:', error)
    }
  }
}
