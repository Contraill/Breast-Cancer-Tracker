<template>
  <div class="home-form-wrapper">
    <br />
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
            <label>Country* 
              <Dropdown 
                v-model="form.country" 
                :options="countries" 
                optionLabel="name" 
                optionValue="code" 
                placeholder="Select Country"
                filter 
                filterBy="name"
                :showClear="true"
                required
                class="custom-dropdown"
              />
            </label>
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
                :class="{'invalid-border': !form.brcaGenes.length}"
                v-if="form.brcaKnown === 'yes'"
                v-model="form.brcaGenes"
                :options="brcaOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select BRCA genes"
                class="w-40"
                display="chip"
                :showSelectAll="true"
              />
            </div>

            <!-- FAMILY HISTORY -->
            <h3>Family History</h3>
            <div class="form-group horizontal-group">
              <label class="main-label">Breast Cancer in Family History Status*</label>
              <select v-model="form.familyHistoryStatus" required>
                <option value="" disabled>Select</option>
                <option>Family History Null</option>
                <option>Family History Unknown</option>
                <option>Family History Known</option>
              </select>
            </div>
            <div v-if="form.familyHistoryStatus === 'Family History Known'" class="extra-fields">
              <input
                type="number"
                min="0"
                step="1"
                v-model.number="form.ageOfOnsetYoungestRelative"
                placeholder="Age of Onset Youngest Relative*"
                required
              />
              &nbsp;
              <MultiSelect
                :class="{'invalid-border': !form.familyHistoryOptions.length}"
                v-model="form.familyHistoryOptions"
                :options="familyHistoryMultiOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Breast Cancer Family History*"
                class="w-40"
                display="chip"
              />
            </div>

            <!-- ALLERGIES -->
            <h3>Allergies</h3>
            <div class="form-group horizontal-group" style="padding: -10px -10px -10px -10px;">
              <label class="main-label">Allergies</label>
              <MultiSelect
                v-model="form.allergies"
                :options="allergyOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select allergies"
                filter
                display="chip"
                class="p-multiselect w-40"
              />
            </div>

            <div v-if="form.allergies.includes('Dressing')" class="extra-field">
              <label for="specifyDressing">Specify Dressing*</label>&nbsp
              <input
                id="specifyDressing"
                type="text"
                v-model="form.specifyDressing"
                :required="form.allergies.includes('Dressing')"
                placeholder="Specify Dressing"
                class="input-field"
              />
            </div><br>

            <div v-if="form.allergies.includes('Other')" class="extra-field">
              <label for="specifyOther">Specify Other Allergies*</label>&nbsp
              <input
                id="specifyOther"
                type="text"
                v-model="form.specifyOtherAllergies"
                :required="form.allergies.includes('Other')"
                placeholder="Specify Other Allergies"
                class="input-field"
              />
            </div>

            <!-- SMOKING, VAPING & ALCOHOL -->
            <h3>Smoking, Vaping & Alcohol</h3>

            <!-- Smoking Status -->
            <div class="form-group horizontal-group">
              <label class="main-label">Smoking Status*</label>
              <select v-model="form.smokingStatus" required>
                <option value="" disabled>Select</option>
                <option>Ex-Smoker</option>
                <option>Smoking</option>
                <option>Non-Smoker</option>
              </select>
            </div>

            <div v-if="form.smokingStatus === 'Ex-Smoker' || form.smokingStatus === 'Smoking'" class="extra-fields">
              <input type="number" min="0" step="1" v-model.number="form.smokingYears" placeholder="Number years smoking*" required /> <br><br>
              <input type="number" min="0" step="1" v-model.number="form.smokedDaily" placeholder="Number smoked daily*" required /> <br><br>
            </div>

            <div v-if="form.smokingStatus === 'Ex-Smoker'" class="extra-fields">
              <input type="number" min="0" step="1" v-model.number="form.yearsStoppedSmoking" placeholder="Number years stopped smoking*" required /><br><br>
            </div>

            <!-- Vaping Status -->
            <div class="form-group horizontal-group">
              <label class="main-label">Vaping Status*</label>
              <select v-model="form.vapingStatus" required>
                <option value="" disabled>Select</option>
                <option>Ex-Vaper</option>
                <option>Vaping</option>
                <option>Non-Vaper</option>
              </select>
            </div>

            <div v-if="form.vapingStatus === 'Ex-Vaper' || form.vapingStatus === 'Vaping'" class="extra-fields">
              <input type="number" min="0" step="1" v-model.number="form.vapingYears" placeholder="Number years vaping*" required /><br><br>
              <input type="number" min="0" step="1" v-model.number="form.vapingPodsPerWeek" placeholder="Average pods/cartridges per week*" required /><br><br>
              <input type="number" min="0" step="1" v-model.number="form.nicotineStrength" placeholder="Nicotine strength used (mg/ml)*" required /><br><br>
            </div>

            <div v-if="form.vapingStatus === 'Ex-Vaper'" class="extra-fields">
              <input type="number" min="0" step="1" v-model.number="form.yearsStoppedVaping" placeholder="Number years stopped vaping*" required /><br><br>
            </div>

            <!-- Alcohol Consumption -->
            <div class="form-group horizontal-group">
              <label class="main-label">Alcohol Consumption*</label>
              <select v-model="form.alcoholStatus" required>
                <option value="" disabled>Select</option>
                <option>Ex-Drinker</option>
                <option>Drinking</option>
                <option>Non-Drinker</option>
              </select>
            </div>

            <div v-if="form.alcoholStatus === 'Ex-Drinker' || form.alcoholStatus === 'Drinking'" class="extra-fields">
              <input type="number" min="0" step="1" v-model.number="form.drinkingYears" placeholder="Number years drinking*" required /><br><br>
              <input type="number" min="0" step="1" v-model.number="form.standardDrinksPerWeek" placeholder="Average standard drinks per week*" required /><br><br>
              <input type="number" min="0" step="1" v-model.number="form.bingeDrinksPerMonth" placeholder="Binge drinking frequency (per month)*" required /><br><br>
            </div>

            <div v-if="form.alcoholStatus === 'Ex-Drinker'" class="extra-fields">
              <input type="number" min="0" step="1" v-model.number="form.yearsStoppedDrinking" placeholder="Number years stopped drinking*" required /><br><br>
            </div>


          </div>
        </TabPanel>
      </TabView>

      <div class="submit-button">
        <button class="submit-btn" @click="saveForm">Save</button>
      </div>
    </div>
  </div>
  <br /><br />
</template>

<script>
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';

export default {
  components: {
    TabView,
    TabPanel,
    MultiSelect,
    Dropdown
  },
  data() {
    return {
      activeIndex: 0,
      countries: [],
      form: {
        consent:"has consent",
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
        hrtPresent: "",
        hrtPresentLength: "",
        hrtPast: "",
        hrtPastYears: null,
        menopauseStatus: "",
        brcaKnown: "",
        brcaGenes: [],
        familyHistoryStatus: "",
        ageOfOnsetYoungestRelative: null,
        familyHistoryOptions: [],
        allergies: [],
        specifyDressing: "",
        specifyOtherAllergies: "",
        smokingStatus: "",
        smokingYears: null,
        smokedDaily: null,
        yearsStoppedSmoking: null,
        vapingStatus: "",
        vapingYears: null,
        vapingPodsPerWeek: null,
        nicotineStrength: null,
        yearsStoppedVaping: null,
        alcoholStatus: "",
        drinkingYears: null,
        standardDrinksPerWeek: null,
        bingeDrinksPerMonth: null,
        yearsStoppedDrinking: null,
      },
      brcaOptions: [
        { label: "BRCA1", value: "BRCA1" },
        { label: "BRCA2", value: "BRCA2" },
      ],
      familyHistoryMultiOptions: [
        { label: "BC in 1st degree relative", value: "BC1" },
        { label: "BC in 1st degree relative (relative < 50 years at diagnosis)", value: "BC1_U50" },
        { label: "BC in 2st degree relative (relative < 50 years at diagnosis)", value: "BC2_U50" },
        { label: "BC in relative (relative < 45 years at diagnosis)", value: "BC_U45" },
        { label: "Family History BRCA Gene", value: "FH_BRCA" },
        { label: "Family History BRCA Gene in 1st degree relative", value: "FH_BRCA1" },
        { label: "Family History of non-breast cancer", value: "FH_NONBC" },
      ],
      allergyOptions: [
        { label: "Coagulation Disorder", value: "Coagulation Disorder" },
        { label: "Dressing", value: "Dressing" },
        { label: "Latex", value: "Latex" },
        { label: "Local Anesthetics", value: "Local Anesthetics" },
        { label: "Other", value: "Other" },
        { label: "Penicillin", value: "Penicillin" }
      ],
    };
  },
  methods: {
    validateForm() {
      if (
        !this.form.firstName ||
        !this.form.surname ||
        !this.form.dob ||
        !this.form.sex ||
        !this.form.address1 ||
        !this.form.city ||
        !this.form.country ||
        !this.form.hrtPresent ||
        !this.form.hrtPast ||
        !this.form.menopauseStatus ||
        !this.form.brcaKnown ||
        !this.form.familyHistoryStatus ||
        !this.form.smokingStatus ||
        !this.form.vapingStatus ||
        !this.form.alcoholStatus
      ) {
        alert("Lütfen tüm zorunlu alanları doldurun.");
        return false;
      }

      if (this.form.hrtPresent === "yes" && !this.form.hrtPresentLength) {
        alert("Lütfen 'Length of current HRT use' alanını doldurun.");
        return false;
      }

      if (this.form.hrtPast === "yes" && (this.form.hrtPastYears === null || this.form.hrtPastYears === "")) {
        alert("Lütfen 'No of Years on HRT' alanını doldurun.");
        return false;
      }

      if (this.form.brcaKnown === "yes" && this.form.brcaGenes.length === 0) {
        alert("Lütfen en az bir BRCA geni seçin.");
        return false;
      }

      if (this.form.familyHistoryStatus === "Family History Known") {
        if (
          this.form.ageOfOnsetYoungestRelative === null ||
          this.form.ageOfOnsetYoungestRelative === "" ||
          this.form.familyHistoryOptions.length === 0
        ) {
          alert("Lütfen Family History Known ile ilgili tüm alanları doldurun.");
          return false;
        }
      }

      if (this.form.allergies.includes("Dressing") && !this.form.specifyDressing) {
        alert("Lütfen 'Specify Dressing' alanını doldurun.");
        return false;
      }

      if (this.form.allergies.includes("Other") && !this.form.specifyOtherAllergies) {
        alert("Lütfen 'Specify Other Allergies' alanını doldurun.");
        return false;
      }

      if (this.form.smokingStatus === "Ex-Smoker" || this.form.smokingStatus === "Smoking") {
        if (
          this.form.smokingYears === null ||
          this.form.smokingYears === "" ||
          this.form.smokedDaily === null ||
          this.form.smokedDaily === ""
        ) {
          alert("Lütfen sigara ile ilgili zorunlu alanları doldurun.");
          return false;
        }
      }

      if (this.form.smokingStatus === "Ex-Smoker" && (this.form.yearsStoppedSmoking === null || this.form.yearsStoppedSmoking === "")) {
        alert("Lütfen 'Number years stopped smoking' alanını doldurun.");
        return false;
      }

      if (this.form.vapingStatus === "Ex-Vaper" || this.form.vapingStatus === "Vaping") {
        if (
          this.form.vapingYears === null ||
          this.form.vapingYears === "" ||
          this.form.vapingPodsPerWeek === null ||
          this.form.vapingPodsPerWeek === "" ||
          this.form.nicotineStrength === null ||
          this.form.nicotineStrength === ""
        ) {
          alert("Lütfen vaping ile ilgili zorunlu alanları doldurun.");
          return false;
        }
      }

      if (this.form.vapingStatus === "Ex-Vaper" && (this.form.yearsStoppedVaping === null || this.form.yearsStoppedVaping === "")) {
        alert("Lütfen 'Number years stopped vaping' alanını doldurun.");
        return false;
      }

      if (this.form.alcoholStatus === "Ex-Drinker" || this.form.alcoholStatus === "Drinking") {
        if (
          this.form.drinkingYears === null ||
          this.form.drinkingYears === "" ||
          this.form.standardDrinksPerWeek === null ||
          this.form.standardDrinksPerWeek === "" ||
          this.form.bingeDrinksPerMonth === null ||
          this.form.bingeDrinksPerMonth === ""
        ) {
          alert("Lütfen alkol ile ilgili zorunlu alanları doldurun.");
          return false;
        }
      }

      if (this.form.alcoholStatus === "Ex-Drinker" && (this.form.yearsStoppedDrinking === null || this.form.yearsStoppedDrinking === "")) {
        alert("Lütfen 'Number years stopped drinking' alanını doldurun.");
        return false;
      }

      return true;
    },

    async saveForm() {
      const user = auth.currentUser;
      if (!user) {
        alert("User is not logged in.");
        return;
      }

      if (!this.validateForm()) {
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);

        const payload = {
          userInformation: {
            email: user.email,
            registerDate: this.form.registerDate || new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString().split('T')[0],
            firstName: this.form.firstName,
            middleName: this.form.middleName,
            surname: this.form.surname,
            maidenName: this.form.maidenName,
            dob: this.form.dob,
            sex: this.form.sex,
          },
          addressInformation: {
            addressLine: {
              address1: this.form.address1,
              address2: this.form.address2,
              address3: this.form.address3,
              address4: this.form.address4,
            },
            city: this.form.city,
            country: this.form.country,
          },
          healthInformation: {
            HRTMenopause: {
              hrtPresent: this.form.hrtPresent,
              hrtPresentLength: this.form.hrtPresentLength,
              hrtPast: this.form.hrtPast,
              hrtPastYears: this.form.hrtPastYears,
              menopauseStatus: this.form.menopauseStatus,
            },
            genetics: {
              brcaKnown: this.form.brcaKnown,
              brcaGenes: this.form.brcaGenes,
            },
            familyHistory: {
              familyHistoryStatus: this.form.familyHistoryStatus,
              ageOfOnsetYoungestRelative: this.form.ageOfOnsetYoungestRelative,
              familyHistoryOptions: this.form.familyHistoryOptions,
            },
            allergies: {
              allergies: this.form.allergies,
              specifyDressing: this.form.specifyDressing,
              specifyOtherAllergies: this.form.specifyOtherAllergies,
            },
            smoking: {
              smokingStatus: this.form.smokingStatus,
              smokingYears: this.form.smokingYears,
              smokedDaily: this.form.smokedDaily,
              yearsStoppedSmoking: this.form.yearsStoppedSmoking,
            },
            vaping: {
              vapingStatus: this.form.vapingStatus,
              vapingYears: this.form.vapingYears,
              vapingPodsPerWeek: this.form.vapingPodsPerWeek,
              nicotineStrength: this.form.nicotineStrength,
              yearsStoppedVaping: this.form.yearsStoppedVaping,
            },
            alcohol: {
              alcoholStatus: this.form.alcoholStatus,
              drinkingYears: this.form.drinkingYears,
              standardDrinksPerWeek: this.form.standardDrinksPerWeek,
              bingeDrinksPerMonth: this.form.bingeDrinksPerMonth,
              yearsStoppedDrinking: this.form.yearsStoppedDrinking,
            },
          },
        };

        await setDoc(docRef, payload);
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

          if (data.userInformation) {
            this.form.firstName = data.userInformation.firstName || "";
            this.form.middleName = data.userInformation.middleName || "";
            this.form.surname = data.userInformation.surname || "";
            this.form.maidenName = data.userInformation.maidenName || "";
            this.form.dob = data.userInformation.dob || "";
            this.form.sex = data.userInformation.sex || "";
            this.form.registerDate = data.userInformation.registerDate || "";
          }

          if (data.addressInformation) {
            this.form.address1 = data.addressInformation.addressLine?.address1 || "";
            this.form.address2 = data.addressInformation.addressLine?.address2 || "";
            this.form.address3 = data.addressInformation.addressLine?.address3 || "";
            this.form.address4 = data.addressInformation.addressLine?.address4 || "";
            this.form.city = data.addressInformation.city || "";
            this.form.country = data.addressInformation.country || "";
          }

          if (data.healthInformation) {
            const hrt = data.healthInformation.HRTMenopause || {};
            this.form.hrtPresent = hrt.hrtPresent || "";
            this.form.hrtPresentLength = hrt.hrtPresentLength || "";
            this.form.hrtPast = hrt.hrtPast || "";
            this.form.hrtPastYears = hrt.hrtPastYears || null;
            this.form.menopauseStatus = hrt.menopauseStatus || "";

            const genetics = data.healthInformation.genetics || {};
            this.form.brcaKnown = genetics.brcaKnown || "";
            this.form.brcaGenes = genetics.brcaGenes || [];

            const family = data.healthInformation.familyHistory || {};
            this.form.familyHistoryStatus = family.familyHistoryStatus || "";
            this.form.ageOfOnsetYoungestRelative = family.ageOfOnsetYoungestRelative || null;
            this.form.familyHistoryOptions = family.familyHistoryOptions || [];

            const allergies = data.healthInformation.allergies || {};
            this.form.allergies = allergies.allergies || [];
            this.form.specifyDressing = allergies.specifyDressing || "";
            this.form.specifyOtherAllergies = allergies.specifyOtherAllergies || "";

            const smoking = data.healthInformation.smoking || {};
            this.form.smokingStatus = smoking.smokingStatus || "";
            this.form.smokingYears = smoking.smokingYears || null;
            this.form.smokedDaily = smoking.smokedDaily || null;
            this.form.yearsStoppedSmoking = smoking.yearsStoppedSmoking || null;

            const vaping = data.healthInformation.vaping || {};
            this.form.vapingStatus = vaping.vapingStatus || "";
            this.form.vapingYears = vaping.vapingYears || null;
            this.form.vapingPodsPerWeek = vaping.vapingPodsPerWeek || null;
            this.form.nicotineStrength = vaping.nicotineStrength || null;
            this.form.yearsStoppedVaping = vaping.yearsStoppedVaping || null;

            const alcohol = data.healthInformation.alcohol || {};
            this.form.alcoholStatus = alcohol.alcoholStatus || "";
            this.form.drinkingYears = alcohol.drinkingYears || null;
            this.form.standardDrinksPerWeek = alcohol.standardDrinksPerWeek || null;
            this.form.bingeDrinksPerMonth = alcohol.bingeDrinksPerMonth || null;
            this.form.yearsStoppedDrinking = alcohol.yearsStoppedDrinking || null;
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    },
  },

  mounted() {
    import('@/assets/countries.js').then(module => {
      this.countries = module.default;
    }).catch(console.error);

    this.loadForm();
  }
};
</script>
