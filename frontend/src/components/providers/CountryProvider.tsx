"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '@/utils/api/api.client';

interface CountryColors {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
}

interface CountryContextType {
  colors: CountryColors;
  setCountryCode: (code: string) => void;
  isLoading: boolean;
}

const defaultColors: CountryColors = {
  primaryColor: '#10b981', // Mexico Emerald Default
  secondaryColor: '#ef4444',
  tertiaryColor: '#ffffff',
};

const CountryContext = createContext<CountryContextType>({
  colors: defaultColors,
  setCountryCode: () => {},
  isLoading: false,
});

export const CountryProvider = ({ children }: { children: React.ReactNode }) => {
  const [colors, setColors] = useState<CountryColors>(defaultColors);
  const [loading, setLoading] = useState(false);

  const fetchCountryColors = async (countryName: string) => {
    setLoading(true);
    try {
      // Assuming GET /region/countries endpoint provides a list of enabled countries.
      // We will search for the specific country and get its colors.
      const response = await apiClient.get(`/region/countries?search=${countryName}`);
      if (response.data && response.data.data && response.data.data.length > 0) {
        const country = response.data.data[0];
        if (country.primaryColor) {
           const newColors = {
             primaryColor: country.primaryColor || defaultColors.primaryColor,
             secondaryColor: country.secondaryColor || defaultColors.secondaryColor,
             tertiaryColor: country.tertiaryColor || defaultColors.tertiaryColor,
           };
           setColors(newColors);
           applyColorsToDOM(newColors);
        }
      }
    } catch (error) {
      console.error("Failed to load country colors", error);
    } finally {
      setLoading(false);
    }
  };

  const applyColorsToDOM = (themeColors: CountryColors) => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', themeColors.primaryColor);
    root.style.setProperty('--theme-secondary', themeColors.secondaryColor);
    root.style.setProperty('--theme-tertiary', themeColors.tertiaryColor);
  };

  // Setup default colors on mount
  useEffect(() => {
    // Initial default check, can be updated if geolocation or IP service is used later
    applyColorsToDOM(defaultColors);
    
    // We can fetch Mexico by default or a specific country logic
    fetchCountryColors('México');
  }, []);

  return (
    <CountryContext.Provider value={{ colors, setCountryCode: fetchCountryColors, isLoading: loading }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountryTheme = () => useContext(CountryContext);
