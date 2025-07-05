import React, { createContext, useState } from 'react';

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
  const [onboardingData, setOnboardingData] = useState({
    mobile: '',
    personalInfo: {},
    bankDetails: {},
    documentUploads: {},
    addressInfo: {},
  });

  const updateData = (key, value) => {
    setOnboardingData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <OnboardingContext.Provider value={{ onboardingData, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
};
