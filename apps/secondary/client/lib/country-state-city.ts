/**
 * Country → State → City data for admission form dropdowns.
 * When country is "Other", state and city are shown as text inputs.
 */

export interface StateCities {
  state: string;
  cities: string[];
}

export interface CountryStatesCities {
  country: string;
  states: StateCities[];
}

export const COUNTRY_STATES_CITIES: CountryStatesCities[] = [
  {
    country: 'Pakistan',
    states: [
      { state: 'Punjab', cities: ['Lahore', 'Faisalabad', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Other'] },
      { state: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah', 'Mirpurkhas', 'Other'] },
      { state: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Mingora', 'Kohat', 'Bannu', 'Other'] },
      { state: 'Balochistan', cities: ['Quetta', 'Gwadar', 'Turbat', 'Khuzdar', 'Other'] },
      { state: 'Gilgit-Baltistan', cities: ['Gilgit', 'Skardu', 'Other'] },
      { state: 'Islamabad', cities: ['Islamabad', 'Other'] },
      { state: 'Azad Jammu and Kashmir', cities: ['Muzaffarabad', 'Mirpur', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'Bangladesh',
    states: [
      { state: 'Dhaka', cities: ['Dhaka', 'Gazipur', 'Narayanganj', 'Other'] },
      { state: 'Chittagong', cities: ['Chittagong', 'Comilla', 'Cox\'s Bazar', 'Other'] },
      { state: 'Sylhet', cities: ['Sylhet', 'Moulvibazar', 'Other'] },
      { state: 'Rajshahi', cities: ['Rajshahi', 'Bogra', 'Other'] },
      { state: 'Khulna', cities: ['Khulna', 'Jessore', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'Afghanistan',
    states: [
      { state: 'Kabul', cities: ['Kabul', 'Other'] },
      { state: 'Herat', cities: ['Herat', 'Other'] },
      { state: 'Kandahar', cities: ['Kandahar', 'Other'] },
      { state: 'Balkh', cities: ['Mazar-i-Sharif', 'Other'] },
      { state: 'Nangarhar', cities: ['Jalalabad', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'Saudi Arabia',
    states: [
      { state: 'Riyadh', cities: ['Riyadh', 'Other'] },
      { state: 'Makkah', cities: ['Makkah', 'Jeddah', 'Taif', 'Other'] },
      { state: 'Madinah', cities: ['Madinah', 'Yanbu', 'Other'] },
      { state: 'Eastern Province', cities: ['Dammam', 'Khobar', 'Jubail', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'UAE',
    states: [
      { state: 'Dubai', cities: ['Dubai', 'Other'] },
      { state: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain', 'Other'] },
      { state: 'Sharjah', cities: ['Sharjah', 'Other'] },
      { state: 'Ajman', cities: ['Ajman', 'Other'] },
      { state: 'Ras Al Khaimah', cities: ['Ras Al Khaimah', 'Other'] },
      { state: 'Fujairah', cities: ['Fujairah', 'Other'] },
      { state: 'Umm Al Quwain', cities: ['Umm Al Quwain', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'United Kingdom',
    states: [
      { state: 'England', cities: ['London', 'Birmingham', 'Manchester', 'Leeds', 'Liverpool', 'Other'] },
      { state: 'Scotland', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Other'] },
      { state: 'Wales', cities: ['Cardiff', 'Swansea', 'Other'] },
      { state: 'Northern Ireland', cities: ['Belfast', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'United States',
    states: [
      { state: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Other'] },
      { state: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Other'] },
      { state: 'Texas', cities: ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Other'] },
      { state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Other'] },
      { state: 'Illinois', cities: ['Chicago', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'Canada',
    states: [
      { state: 'Ontario', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Other'] },
      { state: 'Quebec', cities: ['Montreal', 'Quebec City', 'Other'] },
      { state: 'British Columbia', cities: ['Vancouver', 'Victoria', 'Other'] },
      { state: 'Alberta', cities: ['Calgary', 'Edmonton', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
  {
    country: 'Australia',
    states: [
      { state: 'New South Wales', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Other'] },
      { state: 'Victoria', cities: ['Melbourne', 'Geelong', 'Other'] },
      { state: 'Queensland', cities: ['Brisbane', 'Gold Coast', 'Cairns', 'Other'] },
      { state: 'Western Australia', cities: ['Perth', 'Other'] },
      { state: 'Other', cities: [] },
    ],
  },
];

export function getStatesForCountry(country: string): StateCities[] {
  if (!country || country === 'Other') return [];
  const entry = COUNTRY_STATES_CITIES.find((c) => c.country === country);
  return entry?.states ?? [];
}

export function getCitiesForState(country: string, state: string): string[] {
  if (!country || country === 'Other') return [];
  const states = getStatesForCountry(country);
  const stateEntry = states.find((s) => s.state === state);
  return stateEntry?.cities ?? [];
}

export function isOtherCountry(country: string): boolean {
  return country === 'Other';
}
