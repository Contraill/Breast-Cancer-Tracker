<template>
  <div class="home-form-wrapper">
    <br>
    <h1 class="title">Health Tracker</h1>

    <div class="home-container">
      <TabView v-model:activeIndex="activeIndex">
        <!-- USER INFO -->
        <TabPanel header="User Information">
          <div class="form-grid">
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
        </TabPanel>

        <!-- ADDRESS INFO -->
        <TabPanel header="Address Information">
          <div class="form-grid">
            <label>Address Line 1*<input v-model="form.address1" required /></label>
            <label>Address Line 2<input v-model="form.address2" /></label>
            <label>Address Line 3<input v-model="form.address3" /></label>
            <label>Address Line 4<input v-model="form.address4" /></label>
            <label>City*<input v-model="form.city" required /></label>
            <label>Country*<input v-model="form.country" required /></label>
          </div>
        </TabPanel>

        <!-- HEALTH INFO -->
        <TabPanel header="Health Information">
          <div class="health-info-form">

            <h3>HRT & Menopause</h3>
            <!-- HRT Use (Present) -->
            <div class="form-group horizontal-group">
              <label class="main-label">HRT Use (Present)*</label>

              <div class="radio-group">
                <input type="radio" id="hrtPresentYes" name="hrtPresent" value="yes" v-model="form.hrtPresent" />
                <label for="hrtPresentYes">Yes</label>

                <input type="radio" id="hrtPresentNo" name="hrtPresent" value="no" v-model="form.hrtPresent" />
                <label for="hrtPresentNo">No</label>
              </div>

              <div class="extra-field" v-show="form.hrtPresent === 'yes'">
                <label class="inline-label">Length of current HRT use*</label>
                <select v-model="form.hrtPresentLength" required>
                  <option value="" disabled>Select</option>
                  <option>Using HRT less than 1 year</option>
                  <option>Using HRT greater than 5 years</option>
                  <option>Using HRT 5 years</option>
                  <option>Length of HRT Use Unknown</option>
                </select>
              </div>
            </div>

            <!-- HRT Use (Past) -->
            <div class="form-group horizontal-group">
              <label class="main-label">HRT Use (Past)*</label>

              <div class="radio-group">
                <input type="radio" id="hrtPastYes" name="hrtPast" value="yes" v-model="form.hrtPast" />
                <label for="hrtPastYes">Yes</label>

                <input type="radio" id="hrtPastNo" name="hrtPast" value="no" v-model="form.hrtPast" />
                <label for="hrtPastNo">No</label>
              </div>

              <div class="extra-field" v-show="form.hrtPast === 'yes'">
                <label class="inline-label">No of Years on HRT*</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  v-model.number="form.hrtPastYears"
                  required
                />
              </div>
            </div>

            <!-- Menopause Status -->
            <div class="form-group horizontal-group">
              <label class="main-label">Menopause Status*</label>
              <select v-model="form.menopauseStatus" required>
                <option value="" selected disabled>Select</option>
                <option>Peri-Menopause</option>
                <option>Post-Menopause</option>
                <option>Pre-Menopause</option>
                <option>Unknown</option>
              </select>
            </div>

            <!-- CLIENT GENETICS -->
            <h3>Client Genetics</h3>

            <div class="form-group horizontal-group">
              <label class="main-label">BRCA Status Known*</label>

              <div class="radio-group">
                <input type="radio" id="brcaKnownYes" name="brcaKnown" value="yes" v-model="form.brcaKnown" />
                <label for="brcaKnownYes">Yes</label>

                <input type="radio" id="brcaKnownNo" name="brcaKnown" value="no" v-model="form.brcaKnown" />
                <label for="brcaKnownNo">No</label>
              </div>

              <MultiSelect
                v-if="form.brcaKnown === 'yes'"
                v-model="form.brcaGenes"
                :options="brcaOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select BRCA genes"
                class="w-40"
                display="chip"
              />
            </div>

          </div>
        </TabPanel>
      </TabView>

      <div class="submit-button">
        <button class="submit-btn" @click="saveForm">Save</button>
      </div>
    </div>
  </div>
  <br><br>
</template>

<script>
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import MultiSelect from 'primevue/multiselect'  // Ekleme

export default {
  components: {
    TabView,
    TabPanel,
    MultiSelect  // Register
  },
  data() {
    return {
      activeIndex: 0,
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
        conditions: "",
        hrtPresent: "",
        hrtPresentLength: "",
        hrtPast: "",
        hrtPastYears: null,
        menopauseStatus: "",
        brcaKnown: "",
        brcaGenes: [],
      },
      brcaOptions: [
        { label: "BRCA1", value: "BRCA1" },
        { label: "BRCA2", value: "BRCA2" },
      ],
    };
  },
  methods: {
    async saveForm() {
      const user = auth.currentUser;
      if (!user) {
        alert("User is not logged in.");
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, {
          form: this.form,
          email: user.email
        });
        alert("Data saved successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("An error occurred.");
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
          if (data.form) {
            this.form = { ...this.form, ...data.form };
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
  },
  async mounted() {
    await this.loadForm();
  }
};
</script>
