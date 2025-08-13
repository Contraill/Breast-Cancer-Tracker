<template>
  <br><br><br>
  <div class="auth-container">
    <h1>Welcome</h1>

    <TabView v-model:activeIndex="activeIndex">
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
            :inputStyle="{ paddingRight: '3rem' }"
            :feedback="false"
            :pt="{
              showIcon: { style: 'position: absolute; right: 1.2rem; top: 76%; transform: translateY(-50%);' },
              hideIcon: { style: 'position: absolute; right: 1.2rem; top: 58%; transform: translateY(-50%);' }
            }"
          />

          <Button type="submit" label="Login" class="submit-btn" />
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
            :inputStyle="{ paddingRight: '3rem' }"
            :pt="{
              showIcon: { style: 'position: absolute; right: 1.2rem; top: 76%; transform: translateY(-50%);' },
              hideIcon: { style: 'position: absolute; right: 1.2rem; top: 58%; transform: translateY(-50%);' }
            }"
          />

          <label>Confirm Password</label>
          <Password 
            v-model="password" 
            toggle-mask 
            required 
            class="input-field" 
            :inputStyle="{ paddingRight: '3rem' }"
            :pt="{
              showIcon: { style: 'position: absolute; right: 1.2rem; top: 76%; transform: translateY(-50%);' },
              hideIcon: { style: 'position: absolute; right: 1.2rem; top: 58%; transform: translateY(-50%);' }
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import app from '../firebase'

// PrimeVue Components
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'

const activeIndex = ref(0) // 0: Login, 1: Register

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const consentGiven = ref(false)

const auth = getAuth(app)
const router = useRouter()

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}

const handleRegister = async () => {
  try {
    if (password.value !== confirmPassword.value) {
      alert('Passwords do not match!')
      return
    }
    if (!consentGiven.value) {
      alert('You must agree to the terms before registering.')
      return
    }

    await createUserWithEmailAndPassword(auth, email.value, password.value)
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}
</script>
