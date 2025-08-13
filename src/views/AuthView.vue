<template>
  <br><br><br>
  <div class="auth-container">
    <h1>Welcome</h1>

    <!-- Email Verification Success Message -->
    <div v-if="showVerificationSuccess" class="verification-success">
      <div class="success-icon">✓</div>
      <h3>Email Verified Successfully!</h3>
      <p>Great news! Your email has been verified. You can now access all features of the Breast Cancer Health Tracker.</p>
      <Button @click="proceedToLogin" label="Continue to Login" class="success-btn" />
    </div>

    <!-- Email Verification Error Message -->
    <div v-else-if="showVerificationError" class="verification-error">
      <div class="error-icon">⚠</div>
      <h3>Verification Failed</h3>
      <p>We're sorry, there was a problem verifying your email. The verification link may have expired or already been used.</p>
      <div class="error-actions">
        <Button @click="resendVerification" label="Resend Verification" class="resend-btn" />
        <Button @click="showVerificationError = false" label="Continue" class="continue-btn" />
      </div>
    </div>

    <!-- Reset Password Mode -->
    <div v-else-if="isResetMode">
      <form @submit.prevent="handleResetPassword" class="auth-form">
        <label>New Password</label>
        <Password
          v-model="password"
          toggle-mask
          required
          class="input-field"
          :style="{ width: '320px' }"
          :inputStyle="{ width: '320px'}"
          :pt="{
            showIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
            hideIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' }
          }"
        />

        <label>Confirm Password</label>
        <Password
          v-model="confirmPassword"
          toggle-mask
          required
          class="input-field"
          :style="{ width: '320px' }"
          :inputStyle="{ width: '320px'}"
          :pt="{
            showIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
            hideIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' }
          }"
        />
        <br>
        <Button type="submit" label="Save Password" class="submit-btn" />
      </form>
    </div>

    <!-- Normal Login/Register Tabs -->
    <TabView v-else v-model:activeIndex="activeIndex">
      <!-- Login Tab -->
      <TabPanel header="Login">
        <form @submit.prevent="handleLogin" class="auth-form">
          <label>Email</label>
          <InputText v-model="email" type="email" required class="input-field" />

          <label>Password</label>
          <Password 
            v-model="password" 
            toggle-mask 
            required 
            class="input-field"
            :style="{ width: '290px' }"
            :inputStyle="{ width: '290px'}"
            :pt="{
              showIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
              hideIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' }
            }"
          />

          <Button type="submit" label="Login" class="submit-btn" />

          <Button 
            label="Forgot Password?" 
            link 
            @click="handleForgotPassword" 
            style="margin-top: 10px; font-size: 0.9rem; outline: none !important; border: none !important; box-shadow: none !important;" 
          />
        </form>
      </TabPanel>

      <!-- Register Tab -->
      <TabPanel header="Register">
        <form @submit.prevent="handleRegister" class="auth-form">
          <label>Email</label>
          <InputText v-model="email" type="email" required class="input-field" />

          <label>Password</label>
          <Password
            v-model="password"
            toggle-mask
            required
            class="input-field"
            :maxlength="30"
            :feedback="false"
            :style="{ width: '290px' }"
            :inputStyle="{ width: '290px'}"
            :pt="{
              showIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
              hideIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
              input: { maxlength: 30 }
            }"
            @input="validatePassword"
          />
          <div class="password-requirements">
            <small :class="{ 'valid': passwordValidation.length }" class="requirement">
              ✓ At least 6 characters long
            </small>
            <small :class="{ 'valid': passwordValidation.uppercase }" class="requirement">
              ✓ Contains uppercase letter
            </small>
            <small :class="{ 'valid': passwordValidation.maxLength }" class="requirement">
              ✓ Maximum 30 characters
            </small>
          </div>

          <label>Confirm Password</label>
          <Password
            v-model="confirmPassword"
            toggle-mask
            required
            class="input-field"
            :maxlength="30"
            :feedback="false"
            :style="{ width: '290px' }"
            :inputStyle="{ width: '290px'}"
            :pt="{
              showIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
              hideIcon: { style: 'position: absolute; top: 70%; transform: translateY(-50%);' },
              input: { maxlength: 30 }
            }"
          />

          <div class="consent-box">
            <Checkbox v-model="consentGiven" inputId="consent" :binary="true" />
            <label for="consent" class="consent-label">
              I agree to participate in the Breast Cancer Screening Programme.
              I consent to the storage of my medical data and allow communication from the screening center.
            </label>
          </div>

          <Button type="submit" label="Register" class="submit-btn" />
        </form>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  applyActionCode, 
  verifyPasswordResetCode, 
  confirmPasswordReset 
} from 'firebase/auth'
import app from '../firebase'

import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'

const activeIndex = ref(0)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const consentGiven = ref(false)
const showVerificationSuccess = ref(false)
const showVerificationError = ref(false)
const passwordValidation = ref({
  length: false,
  uppercase: false,
  maxLength: true
})

const auth = getAuth(app)
const router = useRouter()

const isResetMode = ref(false)
let resetOobCode = ''

onMounted(async () => {
  const query = new URLSearchParams(window.location.search)
  const mode = query.get('mode')
  const oobCode = query.get('oobCode')

  if (mode === 'verifyEmail' && oobCode) {
    try {
      await applyActionCode(auth, oobCode)
      showVerificationSuccess.value = true
    } catch (err) {
      console.error(err)
      showVerificationError.value = true
    }
  }

  if (mode === 'resetPassword' && oobCode) {
    try {
      const emailFromCode = await verifyPasswordResetCode(auth, oobCode)
      email.value = emailFromCode
      resetOobCode = oobCode
      isResetMode.value = true
    } catch (err) {
      console.error(err)
      alert('We\'re sorry, there was a problem with your password reset link. The link may have expired or already been used. Please request a new password reset.')
    }
  }
})

const proceedToLogin = () => {
  showVerificationSuccess.value = false
  activeIndex.value = 0
}

const resendVerification = async () => {
  if (!email.value) {
    alert('Please enter your email address first.')
    return
  }
  
  try {
    const currentUser = auth.currentUser
    if (currentUser) {
      await sendEmailVerification(currentUser)
      alert('A new verification email has been sent to your email address.')
    } else {
      alert('Please log in first to resend the verification email.')
    }
  } catch (error) {
    console.error(error)
    alert('We\'re sorry, there was a problem sending the verification email. Please try again.')
  }
}

const validatePassword = () => {
  const pwd = password.value
  passwordValidation.value = {
    length: pwd.length >= 6,
    uppercase: /[A-Z]/.test(pwd),
    maxLength: pwd.length <= 30
  }
}

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (error) {
    console.error(error)
    // Provide user-friendly messages based on common Firebase auth errors
    if (error.code === 'auth/user-not-found') {
      alert('No account found with this email address. Please check your email or create a new account.')
    } else if (error.code === 'auth/wrong-password') {
      alert('Incorrect password. Please check your password and try again.')
    } else if (error.code === 'auth/invalid-email') {
      alert('Please enter a valid email address.')
    } else if (error.code === 'auth/user-disabled') {
      alert('This account has been disabled. Please contact support for assistance.')
    } else if (error.code === 'auth/too-many-requests') {
      alert('Too many failed login attempts. Please wait a moment and try again.')
    } else {
      alert('We\'re sorry, there was a problem signing you in. Please check your email and password and try again.')
    }
  }
}

const handleRegister = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      alert('The passwords you entered don\'t match. Please make sure both password fields are identical.')
      return
    }
    
    // Custom password validation
    if (password.value.length < 6) {
      alert('Password must be at least 6 characters long.')
      return
    }
    
    if (!/[A-Z]/.test(password.value)) {
      alert('Password must contain at least one uppercase letter.')
      return
    }
    
    if (password.value.length > 30) {
      alert('Password must not exceed 30 characters.')
      return
    }
    
    if (!consentGiven.value) {
      alert('Please agree to participate in the Breast Cancer Screening Programme to create your account.')
      return
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    await sendEmailVerification(userCredential.user)

    alert('Your account has been created successfully! We\'ve sent a verification email to your email address. Please check your inbox and verify your email before logging in.')
    router.push('/home')
  } catch (error) {
    console.error(error)
    // Provide user-friendly messages based on common Firebase auth errors
    if (error.code === 'auth/email-already-in-use') {
      alert('An account with this email address already exists. Please try logging in instead.')
    } else if (error.code === 'auth/weak-password') {
      alert('Please choose a stronger password. Your password should be at least 6 characters long and contain an uppercase letter.')
    } else if (error.code === 'auth/invalid-email') {
      alert('Please enter a valid email address.')
    } else {
      alert('We\'re sorry, there was a problem creating your account. Please try again.')
    }
  }
}

const handleForgotPassword = async () => {
  if (!email.value) {
    alert('Please enter your email address in the email field above, then click "Forgot Password?" again.')
    return
  }

  try {
    await sendPasswordResetEmail(auth, email.value)
    alert('A password reset email has been sent to your email address. Please check your inbox and follow the instructions to reset your password.')
  } catch (error) {
    console.error(error)
    if (error.code === 'auth/user-not-found') {
      alert('No account found with this email address. Please check your email or create a new account.')
    } else if (error.code === 'auth/invalid-email') {
      alert('Please enter a valid email address.')
    } else {
      alert('We\'re sorry, there was a problem sending the password reset email. Please try again.')
    }
  }
}

const handleResetPassword = async () => {
  if (!password.value || !confirmPassword.value) {
    alert('Please enter your new password in both fields.')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('The passwords you entered don\'t match. Please make sure both password fields are identical.')
    return
  }
  try {
    await confirmPasswordReset(auth, resetOobCode, password.value)
    alert('Your password has been successfully reset! You can now log in with your new password.')
    router.push('/').then(() => {
      window.location.reload()
    })
  } catch (error) {
    console.error(error)
    if (error.code === 'auth/weak-password') {
      alert('Please choose a stronger password. Your password should be at least 6 characters long.')
    } else if (error.code === 'auth/expired-action-code') {
      alert('This password reset link has expired. Please request a new password reset.')
    } else if (error.code === 'auth/invalid-action-code') {
      alert('This password reset link is invalid or has already been used. Please request a new password reset.')
    } else {
      alert('We\'re sorry, there was a problem resetting your password. Please try requesting a new password reset.')
    }
  }
}

</script>
