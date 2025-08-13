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
              <div class="date-input-wrapper">
                <input 
                  v-model="dobString"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  maxlength="10"
                  required
                  class="date-text-input"
                  @input="handleDateTextInput"
                  @blur="validateDateOfBirth"
                />
                <Calendar 
                  v-model="form.dob"
                  dateFormat="dd/mm/yy"
                  :yearNavigator="true"
                  :yearRange="yearRange"
                  :showIcon="true"
                  :maxDate="maxDateObj"
                  :minDate="minDateObj"
                  @date-select="handleCalendarSelect"
                  class="date-calendar-picker"
                  :inputStyle="{ display: 'none' }"
                  iconDisplay="button"
                />
              </div>
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
                    @input="validateNewEmail"
                  />
                  <div class="input-error" :class="{ show: errors.newEmail }">{{ errors.newEmail }}</div>
                </label>
                <label>Current Password*
                  <input 
                    v-model="emailChange.currentPassword" 
                    type="password" 
                    required 
                    placeholder="Enter your current password to confirm"
                    maxlength="30"
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
                <div class="input-error" :class="{ show: errors.address2 }">{{ errors.address2 }}</div>
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
                <div class="input-error" :class="{ show: errors.address3 }">{{ errors.address3 }}</div>
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
                <div class="input-error" :class="{ show: errors.address4 }">{{ errors.address4 }}</div>
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
                    min="0.1"
                    max="50"
                    step="0.1"
                    v-model.number="form.hrtPastYears"
                    required
                    title="Please enter number of years (0.1-50, decimals allowed for months)"
                    placeholder="e.g. 2.5 years or 0.5 for 6 months"
                    @input="validateHrtYears"
                    @blur="validateHrtYears"
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
                  @blur="validateAgeOfOnset"
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
                  min="0.1" 
                  max="80" 
                  step="0.1" 
                  v-model.number="form.smokingYears" 
                  placeholder="Number years smoking* (0.5 = 6 months)" 
                  required 
                  title="Please enter years (0.1-80, decimals allowed)"
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
                  min="0.1" 
                  max="80" 
                  step="0.1" 
                  v-model.number="form.yearsStoppedSmoking" 
                  placeholder="Years stopped smoking* (0.5 = 6 months)" 
                  required 
                  title="Please enter years (0.1-80, decimals allowed)"
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
                  min="0.1" 
                  max="50" 
                  step="0.1" 
                  v-model.number="form.vapingYears" 
                  placeholder="Number years vaping* (0.5 = 6 months)" 
                  required 
                  title="Please enter years (0.1-50, decimals allowed)"
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
                  min="0.1" 
                  max="50" 
                  step="0.1" 
                  v-model.number="form.yearsStoppedVaping" 
                  placeholder="Years stopped vaping* (0.5 = 6 months)" 
                  required 
                  title="Please enter years (0.1-50, decimals allowed)"
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
                  min="0.1" 
                  max="80" 
                  step="0.1" 
                  v-model.number="form.drinkingYears" 
                  placeholder="Number years drinking* (0.5 = 6 months)" 
                  required 
                  title="Please enter years (0.1-80, decimals allowed)"
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
                  min="0.1" 
                  max="80" 
                  step="0.1" 
                  v-model.number="form.yearsStoppedDrinking" 
                  placeholder="Years stopped drinking* (0.5 = 6 months)" 
                  required 
                  title="Please enter years (0.1-80, decimals allowed)"
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
import { signOut, updateEmail, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged } from "firebase/auth";

import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import MultiSelect from 'primevue/multiselect';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

export default {
  components: {
    TabView,
    TabPanel,
    MultiSelect,
    Dropdown,
    Calendar
  },
  data() {
    return {
      activeIndex: 0,
      countries: [],
      showEmailChange: false,
      currentUserEmail: '',
      authUnsubscribe: null,
      lastEmailChangeTime: 0,
      emailChangeCooldown: 300000, // 5 minutes
      emailChange: {
        newEmail: '',
        currentPassword: ''
      },
      errors: {
        firstName: '',
        surname: '',
        city: '',
        address1: '',
        address2: '',
        address3: '',
        address4: '',
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
        yearsStoppedDrinking: '',
        newEmail: ''
      },
      minDate: '1900-01-01',
      maxDate: new Date().toISOString().split('T')[0],
      minDateObj: new Date(1900, 0, 1),
      maxDateObj: new Date(),
      yearRange: `1900:${new Date().getFullYear()}`,
      dobString: '',
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
        const errorMsg = 'Please use only letters, spaces, hyphens (like O\'Connor) and periods';
        if (fieldName === 'firstname') this.errors.firstName = errorMsg;
        if (fieldName === 'surname') this.errors.surname = errorMsg;
        if (fieldName === 'city') this.errors.city = errorMsg;
        
        // Clean the value without causing cursor issues
        const cleanValue = value.replace(/[^a-zA-ZğĞıİöÖüÜşŞçÇ\s\-'\.]/g, '');
        
        // Only update if the value actually changed to avoid cursor jumping
        if (cleanValue !== value) {
          // Use nextTick to avoid conflicts with Vue's reactivity
          this.$nextTick(() => {
            event.target.value = cleanValue;
            // Update the corresponding form field
            if (fieldName === 'firstname') this.form.firstName = cleanValue;
            else if (fieldName === 'surname') this.form.surname = cleanValue;
            else if (fieldName === 'city') this.form.city = cleanValue;
            else if (fieldName === 'middlename') this.form.middleName = cleanValue;
            else if (fieldName === 'maidenname') this.form.maidenName = cleanValue;
          });
        }
      }
    },

    validateAddressInput(event) {
      const value = event.target.value;
      
      // Find which address field this is by checking the form field name
      let addressField = 'address1';
      let errorField = 'address1';
      
      // Check the parent label to determine which address field
      const labelElement = event.target.closest('label');
      if (labelElement) {
        const labelText = labelElement.textContent;
        if (labelText.includes('Address Line 2')) {
          addressField = 'address2';
          errorField = 'address2';
        } else if (labelText.includes('Address Line 3')) {
          addressField = 'address3';
          errorField = 'address3';
        } else if (labelText.includes('Address Line 4')) {
          addressField = 'address4';
          errorField = 'address4';
        }
      }
      
      // Clear the appropriate error
      this.errors[errorField] = '';
      
      if (value && !/^[a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]*$/.test(value)) {
        this.errors[errorField] = `Please use only letters, numbers, and basic punctuation`;
        
        // Clean the value without causing cursor issues
        const cleanValue = value.replace(/[^a-zA-Z0-9ğĞıİöÖüÜşŞçÇ\s\-\.\,\/\#]/g, '');
        
        // Only update if the value actually changed
        if (cleanValue !== value) {
          this.$nextTick(() => {
            event.target.value = cleanValue;
            // Update the corresponding form field
            this.form[addressField] = cleanValue;
          });
        }
      }
    },

    handleDateTextInput(event) {
      let value = event.target.value;
      
      // Remove any non-numeric characters except /
      value = value.replace(/[^\d\/]/g, '');
      
      // Auto-format DD/MM/YYYY
      if (value.length >= 2 && value.indexOf('/') !== 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
      }
      if (value.length >= 5 && value.lastIndexOf('/') !== 5) {
        value = value.substring(0, 5) + '/' + value.substring(5);
      }
      
      // Update the input value
      event.target.value = value;
      this.dobString = value;
      
      // Try to parse and update form.dob
      if (value.length === 10) {
        const parts = value.split('/');
        if (parts.length === 3) {
          const day = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Month is 0-based
          let year = parseInt(parts[2]);
          
          // Year validation - prevent invalid years like 0001, 0010, etc.
          if (year < 1900 || year > new Date().getFullYear()) {
            this.errors.dob = 'Please enter a valid year between 1900 and current year';
            this.form.dob = null;
            return;
          }
          
          // Month validation
          if (month < 0 || month > 11) {
            this.errors.dob = 'Please enter a valid month (01-12)';
            this.form.dob = null;
            return;
          }
          
          // Day validation
          if (day < 1 || day > 31) {
            this.errors.dob = 'Please enter a valid day (01-31)';
            this.form.dob = null;
            return;
          }
          
          // Check if date is valid (e.g., not Feb 30)
          const testDate = new Date(year, month, day);
          if (testDate.getFullYear() !== year || testDate.getMonth() !== month || testDate.getDate() !== day) {
            this.errors.dob = 'Please enter a valid date';
            this.form.dob = null;
            return;
          }
          
          // All validations passed
          this.form.dob = testDate;
          this.errors.dob = '';
        }
      } else {
        // Clear errors if incomplete date
        this.errors.dob = '';
      }
    },

    handleCalendarSelect(selectedDate) {
      this.form.dob = selectedDate;
      
      // Update string representation
      if (selectedDate) {
        const day = selectedDate.getDate().toString().padStart(2, '0');
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
        const year = selectedDate.getFullYear();
        this.dobString = `${day}/${month}/${year}`;
      }
      
      this.validateDateOfBirth();
    },

    validateDateOfBirth(event) {
      let selectedDate;
      
      // Handle different event types
      if (event instanceof Date) {
        selectedDate = event;
      } else if (event && event.target && event.target.value) {
        // Try to parse DD/MM/YYYY format
        const dateStr = event.target.value;
        if (dateStr.length === 10) {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const year = parseInt(parts[2]);
            selectedDate = new Date(year, month, day);
          }
        }
      } else if (typeof event === 'string') {
        selectedDate = new Date(event);
      } else if (this.form.dob) {
        selectedDate = this.form.dob instanceof Date ? this.form.dob : new Date(this.form.dob);
      }
      
      if (!selectedDate || isNaN(selectedDate)) {
        return; // Don't show error for invalid/incomplete dates during typing
      }
      
      this.errors.dob = '';
      
      const today = new Date();
      const minDate = new Date('1900-01-01');
      const currentYear = today.getFullYear();
      
      // Advanced date validation
      if (selectedDate > today) {
        this.errors.dob = 'Date of birth cannot be in the future';
        this.form.dob = null;
        this.dobString = '';
      } else if (selectedDate < minDate) {
        this.errors.dob = 'Please enter a valid date after 1900';
        this.form.dob = null;
        this.dobString = '';
      } else if (selectedDate.getFullYear() < 1900 || selectedDate.getFullYear() > currentYear) {
        this.errors.dob = `Please enter a valid year between 1900 and ${currentYear}`;
        this.form.dob = null;
        this.dobString = '';
      } else {
        // Date is valid
        this.form.dob = selectedDate;
      }
    },

    handleDateKeydown(event) {
      // For HTML5 date inputs, completely let browser handle
      if (event.target.type === 'date') {
        // Don't interfere with date input at all
        return;
      }
    },

    handleDateInput(event) {
      // For HTML5 date inputs, let browser handle
      if (event.target.type === 'date') {
        return;
      }
      
      // For other inputs (if any), clean the value
      const value = event.target.value;
      const cleanValue = value.replace(/[^\d\-\/]/g, '');
      if (value !== cleanValue) {
        event.target.value = cleanValue;
        this.form.dob = cleanValue;
      }
    },

    validateNewEmail(event) {
      const value = event.target.value;
      this.errors.newEmail = '';
      
      if (value) {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.errors.newEmail = 'Please enter a valid email address';
          return;
        }
        
        // Check if same as current email
        if (value === this.currentUserEmail) {
          this.errors.newEmail = 'New email must be different from current email';
          return;
        }
        
        // Check for reasonable length
        if (value.length > 100) {
          this.errors.newEmail = 'Email address is too long';
          return;
        }
      }
    },

    validateSmokingYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.smokingYears = '';
      
      if (value && (value < 0.1 || value > 80)) {
        this.errors.smokingYears = 'Please enter between 0.1-80 years (use decimals for months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.smokingYears = 'Please enter a valid number';
      }
    },

    validateSmokedDaily(event) {
      const value = parseInt(event.target.value);
      this.errors.smokedDaily = '';
      
      if (value && (value < 1 || value > 200)) {
        this.errors.smokedDaily = 'Please enter a reasonable daily amount (1-200)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.smokedDaily = 'Please enter a valid number';
      }
    },

    validateStoppedSmokingYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.yearsStoppedSmoking = '';
      
      if (value && (value < 0.1 || value > 80)) {
        this.errors.yearsStoppedSmoking = 'Please enter between 0.1-80 years (use decimals for months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.yearsStoppedSmoking = 'Please enter a valid number';
      }
    },

    validateVapingYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.vapingYears = '';
      
      if (value && (value < 0.1 || value > 50)) {
        this.errors.vapingYears = 'Please enter between 0.1-50 years (use decimals for months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.vapingYears = 'Please enter a valid number';
      }
    },

    validateVapingPods(event) {
      const value = parseInt(event.target.value);
      this.errors.vapingPodsPerWeek = '';
      
      if (value && (value < 1 || value > 100)) {
        this.errors.vapingPodsPerWeek = 'Please enter a reasonable weekly amount (1-100)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.vapingPodsPerWeek = 'Please enter a valid number';
      }
    },

    validateHrtYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.hrtPastYears = '';
      
      if (value && (value < 0.1 || value > 50)) {
        this.errors.hrtPastYears = 'Please enter between 0.1-50 years (use decimals for months, e.g. 0.5 = 6 months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.hrtPastYears = 'Please enter a valid number';
      }
    },

    validateAgeOfOnset(event) {
      const value = parseInt(event.target.value);
      this.errors.ageOfOnsetYoungestRelative = '';
      
      if (value && (value < 1 || value > 120)) {
        this.errors.ageOfOnsetYoungestRelative = 'Please enter a valid age (1-120)';
        // Don't auto-correct, let user fix it
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.ageOfOnsetYoungestRelative = 'Please enter a valid number';
      }
    },

    validateNicotineStrength(event) {
      const value = parseInt(event.target.value);
      this.errors.nicotineStrength = '';
      
      if (value && (value < 1 || value > 100)) {
        this.errors.nicotineStrength = 'Please enter a reasonable nicotine strength (1-100 mg/ml)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.nicotineStrength = 'Please enter a valid number';
      }
    },

    validateStoppedVapingYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.yearsStoppedVaping = '';
      
      if (value && (value < 0.1 || value > 50)) {
        this.errors.yearsStoppedVaping = 'Please enter between 0.1-50 years (use decimals for months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.yearsStoppedVaping = 'Please enter a valid number';
      }
    },

    validateDrinkingYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.drinkingYears = '';
      
      if (value && (value < 0.1 || value > 80)) {
        this.errors.drinkingYears = 'Please enter between 0.1-80 years (use decimals for months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.drinkingYears = 'Please enter a valid number';
      }
    },

    validateDrinksPerWeek(event) {
      const value = parseInt(event.target.value);
      this.errors.standardDrinksPerWeek = '';
      
      if (value && (value < 1 || value > 200)) {
        this.errors.standardDrinksPerWeek = 'Please enter a reasonable number of drinks per week (1-200)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.standardDrinksPerWeek = 'Please enter a valid number';
      }
    },

    validateBingeDrinking(event) {
      const value = parseInt(event.target.value);
      this.errors.bingeDrinksPerMonth = '';
      
      if (value !== null && value !== undefined && (value < 0 || value > 30)) {
        this.errors.bingeDrinksPerMonth = 'Please enter frequency per month (0-30)';
      } else if (event.target.value && (isNaN(value) || value < 0)) {
        this.errors.bingeDrinksPerMonth = 'Please enter a valid number (0 or more)';
      }
    },

    validateStoppedDrinkingYears(event) {
      const value = parseFloat(event.target.value);
      this.errors.yearsStoppedDrinking = '';
      
      if (value && (value < 0.1 || value > 80)) {
        this.errors.yearsStoppedDrinking = 'Please enter between 0.1-80 years (use decimals for months)';
      } else if (event.target.value && (!value || isNaN(value))) {
        this.errors.yearsStoppedDrinking = 'Please enter a valid number';
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
            dob: this.form.dob instanceof Date ? this.form.dob.toISOString().split('T')[0] : this.form.dob,
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
              hrtPresentLength: this.form.hrtPresent === 'yes' ? this.form.hrtPresentLength : '',
              hrtPast: this.form.hrtPast,
              hrtPastYears: this.form.hrtPast === 'yes' ? this.form.hrtPastYears : null,
              menopauseStatus: this.form.menopauseStatus,
            },
            genetics: {
              brcaKnown: this.form.brcaKnown,
              brcaGenes: this.form.brcaKnown === 'yes' ? this.form.brcaGenes : [],
            },
            familyHistory: {
              familyHistoryStatus: this.form.familyHistoryStatus,
              ageOfOnsetYoungestRelative: this.form.familyHistoryStatus === 'Family History Known' ? this.form.ageOfOnsetYoungestRelative : null,
              familyHistoryOptions: this.form.familyHistoryStatus === 'Family History Known' ? this.form.familyHistoryOptions : [],
            },
            allergies: {
              allergies: this.form.allergies,
              specifyDressing: this.form.allergies.includes('Dressing') ? this.form.specifyDressing : '',
              specifyOtherAllergies: this.form.allergies.includes('Other') ? this.form.specifyOtherAllergies : '',
            },
            smoking: {
              smokingStatus: this.form.smokingStatus,
              smokingYears: (this.form.smokingStatus === 'Ex-Smoker' || this.form.smokingStatus === 'Smoking') ? this.form.smokingYears : null,
              smokedDaily: (this.form.smokingStatus === 'Ex-Smoker' || this.form.smokingStatus === 'Smoking') ? this.form.smokedDaily : null,
              yearsStoppedSmoking: this.form.smokingStatus === 'Ex-Smoker' ? this.form.yearsStoppedSmoking : null,
            },
            vaping: {
              vapingStatus: this.form.vapingStatus,
              vapingYears: (this.form.vapingStatus === 'Ex-Vaper' || this.form.vapingStatus === 'Vaping') ? this.form.vapingYears : null,
              vapingPodsPerWeek: (this.form.vapingStatus === 'Ex-Vaper' || this.form.vapingStatus === 'Vaping') ? this.form.vapingPodsPerWeek : null,
              nicotineStrength: (this.form.vapingStatus === 'Ex-Vaper' || this.form.vapingStatus === 'Vaping') ? this.form.nicotineStrength : null,
              yearsStoppedVaping: this.form.vapingStatus === 'Ex-Vaper' ? this.form.yearsStoppedVaping : null,
            },
            alcohol: {
              alcoholStatus: this.form.alcoholStatus,
              drinkingYears: (this.form.alcoholStatus === 'Ex-Drinker' || this.form.alcoholStatus === 'Drinking') ? this.form.drinkingYears : null,
              standardDrinksPerWeek: (this.form.alcoholStatus === 'Ex-Drinker' || this.form.alcoholStatus === 'Drinking') ? this.form.standardDrinksPerWeek : null,
              bingeDrinksPerMonth: (this.form.alcoholStatus === 'Ex-Drinker' || this.form.alcoholStatus === 'Drinking') ? this.form.bingeDrinksPerMonth : null,
              yearsStoppedDrinking: this.form.alcoholStatus === 'Ex-Drinker' ? this.form.yearsStoppedDrinking : null,
            },
          },
        };

        await setDoc(docRef, payload);
        alert("Your health information has been saved successfully!");
      } catch (error) {
        // Log error for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error saving data:", error);
        }
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
            this.form.dob = data.userInformation.dob ? new Date(data.userInformation.dob) : null;
            
            // Update dobString for display
            if (this.form.dob) {
              const day = this.form.dob.getDate().toString().padStart(2, '0');
              const month = (this.form.dob.getMonth() + 1).toString().padStart(2, '0');
              const year = this.form.dob.getFullYear();
              this.dobString = `${day}/${month}/${year}`;
            }
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
        // Log error for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error loading data:", error);
        }
        // Silently fail for loading - user can still fill out the form
        // Could show a non-intrusive message if needed
      }
    },

    async handleLogout() {
      try {
        await signOut(auth);
        this.$router.push('/');
      } catch (error) {
        // Log error for debugging in development
        if (process.env.NODE_ENV === 'development') {
          console.error("Error signing out:", error);
        }
        alert("There was a problem signing you out. Please try again.");
      }
    },

    async updateEmail() {
      // Check rate limiting first
      const now = Date.now();
      const timeSinceLastAttempt = now - this.lastEmailChangeTime;
      
      if (timeSinceLastAttempt < this.emailChangeCooldown) {
        const remainingTime = Math.ceil((this.emailChangeCooldown - timeSinceLastAttempt) / 1000);
        this.$toast.add({
          severity: 'warn',
          summary: 'Çok Hızlı!',
          detail: `Email değişikliği için ${remainingTime} saniye bekleyiniz`,
          life: 3000
        });
        return;
      }

      // Basic validation
      if (!this.emailChange.newEmail || !this.emailChange.currentPassword) {
        this.$toast.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Yeni email ve mevcut şifrenizi giriniz',
          life: 3000
        });
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailChange.newEmail)) {
        this.$toast.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Geçerli bir email adresi giriniz',
          life: 3000
        });
        return;
      }

      if (this.emailChange.newEmail === this.currentUserEmail) {
        this.$toast.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Yeni email mevcut email ile aynı olamaz',
          life: 3000
        });
        return;
      }

      try {
        // Record attempt time for rate limiting
        this.lastEmailChangeTime = now;
        
        const user = auth.currentUser;
        if (!user) {
          this.$toast.add({
            severity: 'error',
            summary: 'Hata',
            detail: 'Önce giriş yapınız',
            life: 3000
          });
          return;
        }
        
        // Re-authenticate user (Firebase security requirement)
        const credential = EmailAuthProvider.credential(user.email, this.emailChange.currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update email
        const newEmail = this.emailChange.newEmail;
        await updateEmail(user, newEmail);
        
        // Update UI and reset form
        this.currentUserEmail = newEmail;
        this.cancelEmailChange();
        
        this.$toast.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: `Email başarıyla güncellendi: ${newEmail}`,
          life: 3000
        });
        
      } catch (error) {
        let message = "Email güncellenirken hata: ";
        
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            message = "Mevcut şifreniz yanlış";
            break;
          case 'auth/email-already-in-use':
            message = "Bu email adresi zaten kullanılıyor";
            break;
          case 'auth/requires-recent-login':
            message = "Önce çıkış yapıp tekrar giriş yapınız";
            break;
          default:
            message = error.message || "Bilinmeyen hata";
        }
        
        this.$toast.add({
          severity: 'error',
          summary: 'Hata',
          detail: message,
          life: 3000
        });
      }
    },

    cancelEmailChange() {
      this.showEmailChange = false;
      this.emailChange.newEmail = '';
      this.emailChange.currentPassword = '';
    },

    validateNewEmail(event) {
      const value = event.target.value;
      this.errors.newEmail = '';
      
      if (value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          this.errors.newEmail = 'Please enter a valid email address';
        } else if (value === this.currentUserEmail) {
          this.errors.newEmail = 'New email must be different from current email';
        } else if (value.length > 100) {
          this.errors.newEmail = 'Email address is too long';
        }
      }
    }
  },

  mounted() {
    import('@/assets/countries.js').then(module => {
      this.countries = module.default;
    }).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Auth state change error:', error);
      }
    });

    // Set current user email with auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUserEmail = user.email;
      } else {
        this.currentUserEmail = '';
      }
    });

    // Also set immediately if user is already available
    if (auth.currentUser) {
      this.currentUserEmail = auth.currentUser.email;
    }

    this.loadForm();
    
    // Store the unsubscribe function for cleanup
    this.authUnsubscribe = unsubscribe;
  },

  beforeUnmount() {
    // Clean up auth listener
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
  }
};
</script>
