<template>
  <div class="auth-container">
    <h1>Welcome</h1>
    <div class="button-group">
      <Button
        label="Login"
        @click="formType = 'login'"
        :class="{ active: formType === 'login' }"
        class="toggle-btn"
      />
      <Button
        label="Register"
        @click="formType = 'register'"
        :class="{ active: formType === 'register' }"
        class="toggle-btn"
      />
    </div>

    <form @submit.prevent="handleSubmit" class="auth-form">
      <label>Email</label>
      <InputText v-model="email" type="email" required class="input-field" />

      <label>Password</label>
      <Password v-model="password" toggle-mask required class="input-field" />

      <div v-if="formType === 'register'">
        <label>Confirm Password</label>
        <Password v-model="confirmPassword" toggle-mask required class="input-field" />
      </div>

      <Button type="submit" :label="formType === 'login' ? 'Login' : 'Register'" class="submit-btn" />
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import app from '../firebase'  // Firebase app import edildi

const formType = ref('login')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const auth = getAuth(app)  // Burada app parametresi ile çağrıldı

const handleSubmit = async () => {
  try {
    if (formType.value === 'login') {
      await signInWithEmailAndPassword(auth, email.value, password.value)
    } else {
      if (password.value !== confirmPassword.value) {
        alert('Passwords do not match!')
        return
      }
      await createUserWithEmailAndPassword(auth, email.value, password.value)
    }
    router.push('/home')
  } catch (error) {
    alert(error.message)
  }
}
</script>