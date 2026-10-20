<template>
  <div v-if="authLoading" class="auth-loading">
    <div class="loading-spinner"></div>
    <p>Loading...</p>
  </div>
  <router-view v-else />
  <Toast />
</template>

<script>
import { onMounted, ref } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  setup() {
    const authLoading = ref(true)

    onMounted(() => {
      const auth = getAuth()
      
      // Wait for Firebase to determine authentication state
      onAuthStateChanged(auth, (user) => {
        authLoading.value = false
      })
    })

    return {
      authLoading
    }
  }
}
</script>

<style scoped>
.auth-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-surface-soft);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-loading p {
  color: var(--color-text-muted);
  font-size: 1.1rem;
  margin: 0;
}
</style>
