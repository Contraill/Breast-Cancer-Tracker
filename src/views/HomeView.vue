<template>
  <div class="home-form-wrapper">
    <br />
    <h1 class="title">Health Tracker</h1>

    <div class="home-container">
      <div class="tab-container-with-logout">
        <TabView v-model:activeIndex="activeIndex">
        <!-- USER INFO -->
        <TabPanel header="User Information">
          <div class="form-grid">
            <label>First Name*
              <input 
                v-model="form.firstName" 
                required 
                data-type="name"
                pattern="^[a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]{1,50}$"
                maxlength="50"
                title="Please enter a valid first name (letters, spaces, hyphens, and apostrophes only)"
                @input="validateNameInput"
              />
              <div class="input-error" :class="{ show: errors.firstName }">{{ errors.firstName }}</div>
            </label>
            <label>Middle Name
              <input 
                v-model="form.middleName" 
                data-type="name"
                pattern="^[a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]{0,50}$"
                maxlength="50"
                title="Please enter a valid middle name (letters, spaces, hyphens, and apostrophes only)"
                @input="validateNameInput"
              />
            </label>
            <label>Surname*
              <input 
                v-model="form.surname" 
                required 
                data-type="name"
                pattern="^[a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]{1,50}$"
                maxlength="50"
                title="Please enter a valid surname (letters, spaces, hyphens, and apostrophes only)"
                @input="validateNameInput"
              />
              <div class="input-error" :class="{ show: errors.surname }">{{ errors.surname }}</div>
            </label>
            <label>Maiden Name
              <input 
                v-model="form.maidenName" 
                data-type="name"
                pattern="^[a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]{0,50}$"
                maxlength="50"
                title="Please enter a valid maiden name (letters, spaces, hyphens, and apostrophes only)"
                @input="validateNameInput"
              />
            </label>
            <label>Date of Birth*
              <input 
                v-model="form.dob" 
                type="date" 
                required 
                :min="minDate"
                :max="maxDate"
                title="Please enter a valid date between 1900 and today"
                @change="validateDateOfBirth"
              />
              <div class="input-error" :class="{ show: errors.dob }">{{ errors.dob }}</div>
            </label>
            <label>Sex*
              <select v-model="form.sex" required>
                <option value="" disabled>Select</option>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
          </div>

          <!-- SECTION DIVIDER -->
          <div class="section-divider"></div>

          <!-- EMAIL CHANGE SECTION -->
          <div class="email-change-section">
            <h3>Change Email Address</h3>
            <div class="current-email-display">
              <label>Current Email</label>
              <div class="current-email">{{ currentUserEmail }}</div>
            </div>
            
            <div class="email-change-form" v-if="!showEmailChange">
              <button type="button" @click="showEmailChange = true" class="change-email-btn">
                Change Email Address
              </button>
            </div>

            <div class="email-change-form" v-if="showEmailChange">
              <div class="form-grid">
                <label>New Email Address*
                  <input 
                    v-model="emailChange.newEmail" 
                    type="email" 
                    required 
                    placeholder="Enter your new email address"
                  />
                </label>
                <label>Current Password*
                  <input 
                    v-model="emailChange.currentPassword" 
                    type="password" 
                    required 
                    placeholder="Enter your current password to confirm"
                  />
                </label>
              </div>
              <div class="email-change-buttons">
                <button type="button" @click="updateEmail" class="save-email-btn">
                  Update Email
                </button>
                <button type="button" @click="cancelEmailChange" class="cancel-email-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </TabPanel>          <!-- ADDRESS INFO -->
          <TabPanel header="Address Information">
            <div class="form-grid">
              <label>Address Line 1*
                <input 
                  v-model="form.address1" 
                  required 
                  data-type="address"
                  pattern="^[a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]{1,100}$"
                  maxlength="100"
                  title="Please enter a valid address"
                  @input="validateAddressInput"
                />
                <div class="input-error" :class="{ show: errors.address1 }">{{ errors.address1 }}</div>
              </label>
              <label>Address Line 2
                <input 
                  v-model="form.address2" 
                  data-type="address"
                  pattern="^[a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]{0,100}$"
                  maxlength="100"
                  title="Please enter a valid address"
                  @input="validateAddressInput"
                />
              </label>
              <label>Address Line 3
                <input 
                  v-model="form.address3" 
                  data-type="address"
                  pattern="^[a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]{0,100}$"
                  maxlength="100"
                  title="Please enter a valid address"
                  @input="validateAddressInput"
                />
              </label>
              <label>Address Line 4
                <input 
                  v-model="form.address4" 
                  data-type="address"
                  pattern="^[a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]{0,100}$"
                  maxlength="100"
                  title="Please enter a valid address"
                  @input="validateAddressInput"
                />
              </label>
              <label>City*
                <input 
                  v-model="form.city" 
                  required 
                  data-type="name"
                  pattern="^[a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]{1,50}$"
                  maxlength="50"
                  title="Please enter a valid city name"
                  @input="validateNameInput"
                />
                <div class="input-error" :class="{ show: errors.city }">{{ errors.city }}</div>
              </label>
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
                    min="1"
                    max="50"
                    step="1"
                    v-model.number="form.hrtPastYears"
                    required
                    title="Please enter a reasonable number of years (1-50)"
                    @input="validateHrtYears"
                  />
                  <div class="input-error" :class="{ show: errors.hrtPastYears }">{{ errors.hrtPastYears }}</div>
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

              <!-- SECTION DIVIDER -->
              <div class="section-divider"></div>

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

              <!-- SECTION DIVIDER -->
              <div class="section-divider"></div>

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
                  min="1"
                  max="120"
                  step="1"
                  v-model.number="form.ageOfOnsetYoungestRelative"
                  placeholder="Age of Onset Youngest Relative*"
                  required
                  title="Please enter a valid age (1-120)"
                  @input="validateAgeOfOnset"
                />
                <div class="input-error" :class="{ show: errors.ageOfOnsetYoungestRelative }">{{ errors.ageOfOnsetYoungestRelative }}</div>
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

              <!-- SECTION DIVIDER -->
              <div class="section-divider"></div>

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

              <!-- SECTION DIVIDER -->
              <div class="section-divider"></div>

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
                <input 
                  type="number" 
                  min="1" 
                  max="80" 
                  step="1" 
                  v-model.number="form.smokingYears" 
                  placeholder="Number years smoking*" 
                  required 
                  title="Please enter a reasonable number of years (1-80)"
                  @input="validateSmokingYears"
                /> 
                <div class="input-error" :class="{ show: errors.smokingYears }">{{ errors.smokingYears }}</div>
                <br><br>
                <input 
                  type="number" 
                  min="1" 
                  max="200" 
                  step="1" 
                  v-model.number="form.smokedDaily" 
                  placeholder="Number smoked daily*" 
                  required 
                  title="Please enter a reasonable daily amount (1-200)"
                  @input="validateSmokedDaily"
                /> 
                <div class="input-error" :class="{ show: errors.smokedDaily }">{{ errors.smokedDaily }}</div>
                <br><br>
              </div>

              <div v-if="form.smokingStatus === 'Ex-Smoker'" class="extra-fields">
                <input 
                  type="number" 
                  min="1" 
                  max="80" 
                  step="1" 
                  v-model.number="form.yearsStoppedSmoking" 
                  placeholder="Number years stopped smoking*" 
                  required 
                  title="Please enter a reasonable number of years (1-80)"
                  @input="validateStoppedSmokingYears"
                />
                <div class="input-error" :class="{ show: errors.yearsStoppedSmoking }">{{ errors.yearsStoppedSmoking }}</div>
                <br><br>
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
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  step="1" 
                  v-model.number="form.vapingYears" 
                  placeholder="Number years vaping*" 
                  required 
                  title="Please enter a reasonable number of years (1-50)"
                  @input="validateVapingYears"
                />
                <div class="input-error" :class="{ show: errors.vapingYears }">{{ errors.vapingYears }}</div>
                <br><br>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  step="1" 
                  v-model.number="form.vapingPodsPerWeek" 
                  placeholder="Average pods/cartridges per week*" 
                  required 
                  title="Please enter a reasonable weekly amount (1-100)"
                  @input="validateVapingPods"
                />
                <div class="input-error" :class="{ show: errors.vapingPodsPerWeek }">{{ errors.vapingPodsPerWeek }}</div>
                <br><br>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  step="1" 
                  v-model.number="form.nicotineStrength" 
                  placeholder="Nicotine strength used (mg/ml)*" 
                  required 
                  title="Please enter a reasonable nicotine strength (1-100 mg/ml)"
                  @input="validateNicotineStrength"
                />
                <div class="input-error" :class="{ show: errors.nicotineStrength }">{{ errors.nicotineStrength }}</div>
                <br><br>
              </div>

              <div v-if="form.vapingStatus === 'Ex-Vaper'" class="extra-fields">
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  step="1" 
                  v-model.number="form.yearsStoppedVaping" 
                  placeholder="Number years stopped vaping*" 
                  required 
                  title="Please enter a reasonable number of years (1-50)"
                  @input="validateStoppedVapingYears"
                />
                <div class="input-error" :class="{ show: errors.yearsStoppedVaping }">{{ errors.yearsStoppedVaping }}</div>
                <br><br>
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
                <input 
                  type="number" 
                  min="1" 
                  max="80" 
                  step="1" 
                  v-model.number="form.drinkingYears" 
                  placeholder="Number years drinking*" 
                  required 
                  title="Please enter a reasonable number of years (1-80)"
                  @input="validateDrinkingYears"
                />
                <div class="input-error" :class="{ show: errors.drinkingYears }">{{ errors.drinkingYears }}</div>
                <br><br>
                <input 
                  type="number" 
                  min="1" 
                  max="200" 
                  step="1" 
                  v-model.number="form.standardDrinksPerWeek" 
                  placeholder="Average standard drinks per week*" 
                  required 
                  title="Please enter a reasonable number of drinks per week (1-200)"
                  @input="validateDrinksPerWeek"
                />
                <div class="input-error" :class="{ show: errors.standardDrinksPerWeek }">{{ errors.standardDrinksPerWeek }}</div>
                <br><br>
                <input 
                  type="number" 
                  min="0" 
                  max="30" 
                  step="1" 
                  v-model.number="form.bingeDrinksPerMonth" 
                  placeholder="Binge drinking frequency (per month)*" 
                  required 
                  title="Please enter frequency of binge drinking per month (0-30)"
                  @input="validateBingeDrinking"
                />
                <div class="input-error" :class="{ show: errors.bingeDrinksPerMonth }">{{ errors.bingeDrinksPerMonth }}</div>
                <br><br>
              </div>

              <div v-if="form.alcoholStatus === 'Ex-Drinker'" class="extra-fields">
                <input 
                  type="number" 
                  min="1" 
                  max="80" 
                  step="1" 
                  v-model.number="form.yearsStoppedDrinking" 
                  placeholder="Number years stopped drinking*" 
                  required 
                  title="Please enter a reasonable number of years (1-80)"
                  @input="validateStoppedDrinkingYears"
                />
                <div class="input-error" :class="{ show: errors.yearsStoppedDrinking }">{{ errors.yearsStoppedDrinking }}</div>
                <br><br>
              </div>


            </div>
          </TabPanel>
        </TabView>
        
        <!-- Logout Tab Button -->
        <button class="logout-tab-btn" @click="handleLogout">
          <i class="pi pi-sign-out"></i>
          <span>Logout</span>
        </button>
      </div>

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
import { signOut, updateEmail, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

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
      showEmailChange: false,
      currentUserEmail: '',
      emailChange: {
        newEmail: '',
        currentPassword: ''
      },
      errors: {
        firstName: '',
        surname: '',
        city: '',
        address1: '',
        dob: '',
        hrtPastYears: '',
        ageOfOnsetYoungestRelative: '',
        smokingYears: '',
        smokedDaily: '',
        yearsStoppedSmoking: '',
        vapingYears: '',
        vapingPodsPerWeek: '',
        nicotineStrength: '',
        yearsStoppedVaping: '',
        drinkingYears: '',
        standardDrinksPerWeek: '',
        bingeDrinksPerMonth: '',
        yearsStoppedDrinking: ''
      },
      minDate: '1900-01-01',
      maxDate: new Date().toISOString().split('T')[0],
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
        alert("Please fill in all required fields to continue.");
        return false;
      }

      if (this.form.hrtPresent === "yes" && !this.form.hrtPresentLength) {
        alert("Please specify the length of your current HRT use.");
        return false;
      }

      if (this.form.hrtPast === "yes" && (this.form.hrtPastYears === null || this.form.hrtPastYears === "")) {
        alert("Please enter the number of years you used HRT in the past.");
        return false;
      }

      if (this.form.brcaKnown === "yes" && this.form.brcaGenes.length === 0) {
        alert("Please select at least one BRCA gene option.");
        return false;
      }

      if (this.form.familyHistoryStatus === "Family History Known") {
        if (
          this.form.ageOfOnsetYoungestRelative === null ||
          this.form.ageOfOnsetYoungestRelative === "" ||
          this.form.familyHistoryOptions.length === 0
        ) {
          alert("Please complete all family history fields, including the age of onset and family history options.");
          return false;
        }
      }

      if (this.form.allergies.includes("Dressing") && !this.form.specifyDressing) {
        alert("Please specify the type of dressing allergy you have.");
        return false;
      }

      if (this.form.allergies.includes("Other") && !this.form.specifyOtherAllergies) {
        alert("Please specify your other allergies.");
        return false;
      }

      if (this.form.smokingStatus === "Ex-Smoker" || this.form.smokingStatus === "Smoking") {
        if (
          this.form.smokingYears === null ||
          this.form.smokingYears === "" ||
          this.form.smokedDaily === null ||
          this.form.smokedDaily === ""
        ) {
          alert("Please complete all smoking-related fields including years of smoking and daily amount.");
          return false;
        }
      }

      if (this.form.smokingStatus === "Ex-Smoker" && (this.form.yearsStoppedSmoking === null || this.form.yearsStoppedSmoking === "")) {
        alert("Please enter how many years ago you stopped smoking.");
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
          alert("Please complete all vaping-related fields including years, pods per week, and nicotine strength.");
          return false;
        }
      }

      if (this.form.vapingStatus === "Ex-Vaper" && (this.form.yearsStoppedVaping === null || this.form.yearsStoppedVaping === "")) {
        alert("Please enter how many years ago you stopped vaping.");
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
          alert("Please complete all alcohol-related fields including years, drinks per week, and binge frequency.");
          return false;
        }
      }

      if (this.form.alcoholStatus === "Ex-Drinker" && (this.form.yearsStoppedDrinking === null || this.form.yearsStoppedDrinking === "")) {
        alert("Please enter how many years ago you stopped drinking alcohol.");
        return false;
      }

      return true;
    },

    // Input validation methods
    validateNameInput(event) {
      const value = event.target.value;
      const fieldName = event.target.closest('label').textContent.split('*')[0].trim().toLowerCase().replace(/\s/g, '');
      
      // Clear previous errors
      if (fieldName === 'firstname') this.errors.firstName = '';
      if (fieldName === 'surname') this.errors.surname = '';
      if (fieldName === 'city') this.errors.city = '';
      
      if (value && !/^[a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]*$/.test(value)) {
        const errorMsg = 'Only letters, spaces, hyphens, and apostrophes are allowed';
        if (fieldName === 'firstname') this.errors.firstName = errorMsg;
        if (fieldName === 'surname') this.errors.surname = errorMsg;
        if (fieldName === 'city') this.errors.city = errorMsg;
        
        // Remove invalid characters
        event.target.value = value.replace(/[^a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]/g, '');
      }
    },

    validateAddressInput(event) {
      const value = event.target.value;
      const isRequired = event.target.hasAttribute('required');
      
      this.errors.address1 = '';
      
      if (value && !/^[a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]*$/.test(value)) {
        this.errors.address1 = 'Please use only letters, numbers, and basic punctuation';
        event.target.value = value.replace(/[^a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]/g, '');
      }
    },

    validateDateOfBirth(event) {
      const value = event.target.value;
      this.errors.dob = '';
      
      if (value) {
        const selectedDate = new Date(value);
        const today = new Date();
        const minDate = new Date('1900-01-01');
        
        if (selectedDate > today) {
          this.errors.dob = 'Date of birth cannot be in the future';
          event.target.value = '';
        } else if (selectedDate < minDate) {
          this.errors.dob = 'Please enter a valid date after 1900';
          event.target.value = '';
        }
      }
    },

    validateSmokingYears(event) {
      const value = parseInt(event.target.value);
      this.errors.smokingYears = '';
      
      if (value && (value < 1 || value > 80)) {
        this.errors.smokingYears = 'Please enter a reasonable number of years (1-80)';
        event.target.value = Math.min(Math.max(1, value), 80);
      }
    },

    validateSmokedDaily(event) {
      const value = parseInt(event.target.value);
      this.errors.smokedDaily = '';
      
      if (value && (value < 1 || value > 200)) {
        this.errors.smokedDaily = 'Please enter a reasonable daily amount (1-200)';
        event.target.value = Math.min(Math.max(1, value), 200);
      }
    },

    validateStoppedSmokingYears(event) {
      const value = parseInt(event.target.value);
      this.errors.yearsStoppedSmoking = '';
      
      if (value && (value < 1 || value > 80)) {
        this.errors.yearsStoppedSmoking = 'Please enter a reasonable number of years (1-80)';
        event.target.value = Math.min(Math.max(1, value), 80);
      }
    },

    validateVapingYears(event) {
      const value = parseInt(event.target.value);
      this.errors.vapingYears = '';
      
      if (value && (value < 1 || value > 50)) {
        this.errors.vapingYears = 'Please enter a reasonable number of years (1-50)';
        event.target.value = Math.min(Math.max(1, value), 50);
      }
    },

    validateVapingPods(event) {
      const value = parseInt(event.target.value);
      this.errors.vapingPodsPerWeek = '';
      
      if (value && (value < 1 || value > 100)) {
        this.errors.vapingPodsPerWeek = 'Please enter a reasonable weekly amount (1-100)';
        event.target.value = Math.min(Math.max(1, value), 100);
      }
    },

    validateHrtYears(event) {
      const value = parseInt(event.target.value);
      this.errors.hrtPastYears = '';
      
      if (value && (value < 1 || value > 50)) {
        this.errors.hrtPastYears = 'Please enter a reasonable number of years (1-50)';
        event.target.value = Math.min(Math.max(1, value), 50);
      }
    },

    validateAgeOfOnset(event) {
      const value = parseInt(event.target.value);
      this.errors.ageOfOnsetYoungestRelative = '';
      
      if (value && (value < 1 || value > 120)) {
        this.errors.ageOfOnsetYoungestRelative = 'Please enter a valid age (1-120)';
        event.target.value = Math.min(Math.max(1, value), 120);
      }
    },

    validateNicotineStrength(event) {
      const value = parseInt(event.target.value);
      this.errors.nicotineStrength = '';
      
      if (value && (value < 1 || value > 100)) {
        this.errors.nicotineStrength = 'Please enter a reasonable nicotine strength (1-100 mg/ml)';
        event.target.value = Math.min(Math.max(1, value), 100);
      }
    },

    validateStoppedVapingYears(event) {
      const value = parseInt(event.target.value);
      this.errors.yearsStoppedVaping = '';
      
      if (value && (value < 1 || value > 50)) {
        this.errors.yearsStoppedVaping = 'Please enter a reasonable number of years (1-50)';
        event.target.value = Math.min(Math.max(1, value), 50);
      }
    },

    validateDrinkingYears(event) {
      const value = parseInt(event.target.value);
      this.errors.drinkingYears = '';
      
      if (value && (value < 1 || value > 80)) {
        this.errors.drinkingYears = 'Please enter a reasonable number of years (1-80)';
        event.target.value = Math.min(Math.max(1, value), 80);
      }
    },

    validateDrinksPerWeek(event) {
      const value = parseInt(event.target.value);
      this.errors.standardDrinksPerWeek = '';
      
      if (value && (value < 1 || value > 200)) {
        this.errors.standardDrinksPerWeek = 'Please enter a reasonable number of drinks per week (1-200)';
        event.target.value = Math.min(Math.max(1, value), 200);
      }
    },

    validateBingeDrinking(event) {
      const value = parseInt(event.target.value);
      this.errors.bingeDrinksPerMonth = '';
      
      if (value && (value < 0 || value > 30)) {
        this.errors.bingeDrinksPerMonth = 'Please enter frequency per month (0-30)';
        event.target.value = Math.min(Math.max(0, value), 30);
      }
    },

    validateStoppedDrinkingYears(event) {
      const value = parseInt(event.target.value);
      this.errors.yearsStoppedDrinking = '';
      
      if (value && (value < 1 || value > 80)) {
        this.errors.yearsStoppedDrinking = 'Please enter a reasonable number of years (1-80)';
        event.target.value = Math.min(Math.max(1, value), 80);
      }
    },

    async saveForm() {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to save your health information.");
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
        alert("Your health information has been saved successfully!");
      } catch (error) {
        console.error("Error saving data:", error);
        alert("We're sorry, there was a problem saving your information. Please check your internet connection and try again.");
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
        // Silently fail for loading - user can still fill out the form
        // Could show a non-intrusive message if needed
      }
    },

    async handleLogout() {
      try {
        await signOut(auth);
        this.$router.push('/');
      } catch (error) {
        console.error("Error signing out:", error);
        alert("There was a problem signing you out. Please try again.");
      }
    },

    async updateEmail() {
      if (!this.emailChange.newEmail || !this.emailChange.currentPassword) {
        alert("Please fill in both the new email and current password fields.");
        return;
      }

      if (this.emailChange.newEmail === this.currentUserEmail) {
        alert("The new email is the same as your current email. Please enter a different email address.");
        return;
      }

      try {
        const user = auth.currentUser;
        
        // Create credential with current password
        const credential = EmailAuthProvider.credential(
          user.email,
          this.emailChange.currentPassword
        );

        // Re-authenticate user
        await reauthenticateWithCredential(user, credential);
        
        // Update email
        await updateEmail(user, this.emailChange.newEmail);
        
        // Update current email display
        this.currentUserEmail = this.emailChange.newEmail;
        
        // Reset form and hide
        this.cancelEmailChange();
        
        alert("Your email address has been successfully updated!");
        
      } catch (error) {
        console.error("Error updating email:", error);
        
        if (error.code === 'auth/wrong-password') {
          alert("Incorrect password. Please check your current password and try again.");
        } else if (error.code === 'auth/email-already-in-use') {
          alert("This email address is already in use by another account.");
        } else if (error.code === 'auth/invalid-email') {
          alert("Please enter a valid email address.");
        } else if (error.code === 'auth/requires-recent-login') {
          alert("For security reasons, please log out and log back in before changing your email.");
        } else {
          alert("We're sorry, there was a problem updating your email address. Please try again.");
        }
      }
    },

    cancelEmailChange() {
      this.showEmailChange = false;
      this.emailChange.newEmail = '';
      this.emailChange.currentPassword = '';
    }
  },

  mounted() {
    import('@/assets/countries.js').then(module => {
      this.countries = module.default;
    }).catch(console.error);

    // Set current user email
    if (auth.currentUser) {
      this.currentUserEmail = auth.currentUser.email;
    }

    this.loadForm();
  }
};
</script>
