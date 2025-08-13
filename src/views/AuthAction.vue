<template>
  <div class="auth-action-page">
    <div v-if="loading">İşlem yapılıyor...</div>

    <!-- Email doğrulama -->
    <div v-if="mode === 'verifyEmail' && !loading">
      <h1>Email Doğrulama</h1>
      <p v-if="success">Email başarıyla doğrulandı ✅</p>
      <p v-else-if="error">Doğrulama bağlantısı geçersiz veya süresi dolmuş ❌</p>
    </div>

    <!-- Şifre sıfırlama -->
    <div v-if="mode === 'resetPassword' && !loading">
      <h1>Şifre Sıfırlama</h1>
      <div v-if="success">Şifre başarıyla güncellendi ✅</div>
      <div v-else>
        <input
          type="password"
          placeholder="Yeni şifre"
          v-model="newPassword"
        />
        <button @click="handleResetPassword">Şifreyi Güncelle</button>
        <p v-if="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, applyActionCode, confirmPasswordReset } from "firebase/auth";

export default {
  name: "AuthAction",
  data() {
    return {
      mode: null,          // verifyEmail veya resetPassword
      oobCode: null,
      newPassword: "",
      success: false,
      error: false,
      errorMessage: "",
      loading: true
    };
  },
  async mounted() {
    const query = this.$route.query;
    this.mode = query.mode;
    this.oobCode = query.oobCode;

    if (!this.mode || !this.oobCode) {
      this.error = true;
      this.loading = false;
      return;
    }

    const auth = getAuth();

    if (this.mode === "verifyEmail") {
      try {
        await applyActionCode(auth, this.oobCode);
        this.success = true;
      } catch (e) {
        console.error(e);
        this.error = true;
      }
      this.loading = false;
    } else if (this.mode === "resetPassword") {
      // Şifre sıfırlama işlemi buton ile yapılacak, o yüzden sadece yüklemeyi kapatıyoruz
      this.loading = false;
    }
  },
  methods: {
    async handleResetPassword() {
      const auth = getAuth();
      try {
        await confirmPasswordReset(auth, this.oobCode, this.newPassword);
        this.success = true;
        this.error = false;
      } catch (e) {
        console.error(e);
        this.error = true;
        this.errorMessage = "Şifre sıfırlanırken hata oluştu.";
      }
    }
  }
};
</script>

<style>
.auth-action-page {
  text-align: center;
  padding: 20px;
}
.auth-action-page input {
  padding: 8px;
  margin: 10px 0;
}
</style>
