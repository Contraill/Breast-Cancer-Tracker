// Firestore document shape for users/{uid}. firestore.rules validates exactly these keys.
export function buildProfilePayload(form, email) {
  return {
    userInformation: {
      email,
      registerDate: form.registerDate || new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      firstName: form.firstName,
      middleName: form.middleName,
      surname: form.surname,
      maidenName: form.maidenName,
      dob: form.dob instanceof Date ? form.dob.toISOString().split('T')[0] : form.dob,
      sex: form.sex,
    },
    addressInformation: {
      addressLine: {
        address1: form.address1,
        address2: form.address2,
        address3: form.address3,
        address4: form.address4,
      },
      city: form.city,
      country: form.country,
    },
    healthInformation: {
      HRTMenopause: {
        hrtPresent: form.hrtPresent,
        hrtPresentLength: form.hrtPresent === 'yes' ? form.hrtPresentLength : '',
        hrtPast: form.hrtPast,
        hrtPastYears: form.hrtPast === 'yes' ? form.hrtPastYears : null,
        menopauseStatus: form.menopauseStatus,
      },
      genetics: {
        brcaKnown: form.brcaKnown,
        brcaGenes: form.brcaKnown === 'yes' ? form.brcaGenes : [],
      },
      familyHistory: {
        familyHistoryStatus: form.familyHistoryStatus,
        ageOfOnsetYoungestRelative: form.familyHistoryStatus === 'Family History Known' ? form.ageOfOnsetYoungestRelative : null,
        familyHistoryOptions: form.familyHistoryStatus === 'Family History Known' ? form.familyHistoryOptions : [],
      },
      allergies: {
        allergies: form.allergies,
        specifyDressing: form.allergies.includes('Dressing') ? form.specifyDressing : '',
        specifyOtherAllergies: form.allergies.includes('Other') ? form.specifyOtherAllergies : '',
      },
      smoking: {
        smokingStatus: form.smokingStatus,
        smokingYears: (form.smokingStatus === 'Ex-Smoker' || form.smokingStatus === 'Smoking') ? form.smokingYears : null,
        smokedDaily: (form.smokingStatus === 'Ex-Smoker' || form.smokingStatus === 'Smoking') ? form.smokedDaily : null,
        yearsStoppedSmoking: form.smokingStatus === 'Ex-Smoker' ? form.yearsStoppedSmoking : null,
      },
      vaping: {
        vapingStatus: form.vapingStatus,
        vapingYears: (form.vapingStatus === 'Ex-Vaper' || form.vapingStatus === 'Vaping') ? form.vapingYears : null,
        vapingPodsPerWeek: (form.vapingStatus === 'Ex-Vaper' || form.vapingStatus === 'Vaping') ? form.vapingPodsPerWeek : null,
        nicotineStrength: (form.vapingStatus === 'Ex-Vaper' || form.vapingStatus === 'Vaping') ? form.nicotineStrength : null,
        yearsStoppedVaping: form.vapingStatus === 'Ex-Vaper' ? form.yearsStoppedVaping : null,
      },
      alcohol: {
        alcoholStatus: form.alcoholStatus,
        drinkingYears: (form.alcoholStatus === 'Ex-Drinker' || form.alcoholStatus === 'Drinking') ? form.drinkingYears : null,
        standardDrinksPerWeek: (form.alcoholStatus === 'Ex-Drinker' || form.alcoholStatus === 'Drinking') ? form.standardDrinksPerWeek : null,
        bingeDrinksPerMonth: (form.alcoholStatus === 'Ex-Drinker' || form.alcoholStatus === 'Drinking') ? form.bingeDrinksPerMonth : null,
        yearsStoppedDrinking: form.alcoholStatus === 'Ex-Drinker' ? form.yearsStoppedDrinking : null,
      },
    },
  };
}
