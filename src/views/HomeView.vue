<template>
  <div class="home-container">
    <h1 class="title">Health Tracker</h1>
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="{ active: activeTab === tab }"
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- USER INFO -->
      <div v-if="activeTab === 'User Information'" class="form-grid">
        <label>First Name*<input v-model="form.firstName" required /></label>
        <label>Middle Name<input v-model="form.middleName" /></label>
        <label>Surname*<input v-model="form.surname" required /></label>
        <label>Maiden Name<input v-model="form.maidenName" /></label>
        <label>Date of Birth*<input v-model="form.dob" type="date" required /></label>
        <label>Sex*
          <select v-model="form.sex" required>
            <option value="" disabled>Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </label>
      </div>

      <!-- ADDRESS INFO -->
      <div v-if="activeTab === 'Address Information'" class="form-grid">
        <label>Address Line 1*<input v-model="form.address1" required /></label>
        <label>Address Line 2<input v-model="form.address2" /></label>
        <label>Address Line 3<input v-model="form.address3" /></label>
        <label>Address Line 4<input v-model="form.address4" /></label>
        <label>City*<input v-model="form.city" required /></label>
        <label>Country*<input v-model="form.country" required /></label>
      </div>

      <!-- HEALTH INFO -->
      <div v-if="activeTab === 'Health Information'" class="form-grid">
        <label>Height (cm)<input v-model="form.height" type="number" /></label>
        <label>Weight (kg)<input v-model="form.weight" type="number" /></label>
        <label>Medical Conditions<textarea v-model="form.conditions" /></label>
      </div>

      <div class="submit-button">
        <button class="submit-btn" @click="saveForm">Save</button>
      </div>

    </form>
  </div>
</template>

<script>
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default {
  data() {
    return {
      activeTab: 'User Information',
      tabs: ['User Information', 'Address Information', 'Health Information'],
      form: {
        firstName: "",
        middleName: "",
        surname: "",
        maidenName: "",
        dob: "",
        sex: "",
        address1: "",
        address2: "",
        address3: "",
        address4: "",
        city: "",
        country: "",
        height: "",
        weight: "",
        conditions: ""
      }
    };
  },
  methods: {
    async saveForm() {
      const user = auth.currentUser;
      if (!user) {
        alert("Kullanıcı giriş yapmamış.");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
          form: this.form,
          email: user.email
        });
        alert("Veriler başarıyla kaydedildi!");
      } catch (error) {
        console.error("Veri kaydedilirken hata:", error);
        alert("Bir hata oluştu.");
      }
    },
    async loadForm() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Eğer "form" alanı varsa, formu onunla doldur
          if (data.form) {
            this.form = { ...this.form, ...data.form };
          }
        }
      } catch (error) {
        console.error("Veri çekilirken hata:", error);
      }
    }
  },
  async mounted() {
    // Sayfa yüklendiğinde form verisini çek
    await this.loadForm();
  }
};
</script>




<style src="../style/main.css"></style>
