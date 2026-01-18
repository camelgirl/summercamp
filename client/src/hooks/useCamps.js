import { useState, useEffect, useMemo } from 'react';

export function useCamps(apiEndpoint) {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try API endpoint first (works with Netlify Functions in production, local server in dev)
        let response = await fetch(apiEndpoint);
        
        // If API fails, try static file as fallback
        if (!response.ok) {
          console.log(`API failed, trying static file...`);
          const staticUrl = apiEndpoint === '/api/camps' 
            ? '/camps-data.json' 
            : '/school-district-camps.json';
          response = await fetch(staticUrl);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch camps: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected an array');
        }
        
        console.log(`Loaded ${data.length} camps`);
        setCamps(data);
        setError(null);
      } catch (err) {
        console.error('Error loading camps:', err);
        setError(err.message);
        setCamps([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [apiEndpoint]);

  return { camps, loading, error };
}

export function useFilteredCamps(camps, filters) {
  const { searchTerm, ageFilter, typeFilter, districtFilter, costFilter, dateFilter } = filters;

  const filteredCamps = useMemo(() => {
    return camps.filter((camp) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (camp.type && camp.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (camp.location && camp.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (camp.notes && camp.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      // District filter
      const matchesDistrict = !districtFilter || camp.district === districtFilter;

      // Type filter
      const matchesType = !typeFilter || camp.type === typeFilter;

      // Cost filter
      let matchesCost = true;
      if (costFilter && camp.cost) {
        const costStr = camp.cost.toLowerCase();
        const costNum = extractCost(costStr);
        
        switch (costFilter) {
          case 'free':
            matchesCost = costStr.includes('free') || costNum === 0;
            break;
          case '0-100':
            matchesCost = costNum > 0 && costNum <= 100;
            break;
          case '100-200':
            matchesCost = costNum > 100 && costNum <= 200;
            break;
          case '200-300':
            matchesCost = costNum > 200 && costNum <= 300;
            break;
          case '300+':
            matchesCost = costNum > 300;
            break;
          default:
            matchesCost = true;
        }
      }

      // Date filter
      let matchesDate = true;
      if (dateFilter && camp.dates) {
        const datesStr = camp.dates.toLowerCase();
        const monthMap = {
          'may': 'may',
          'june': 'june',
          'july': 'july',
          'august': 'august',
        };
        
        switch (dateFilter) {
          case 'may':
            matchesDate = datesStr.includes('may');
            break;
          case 'june':
            matchesDate = datesStr.includes('june');
            break;
          case 'july':
            matchesDate = datesStr.includes('july');
            break;
          case 'august':
            matchesDate = datesStr.includes('august');
            break;
          case 'may-june':
            matchesDate = datesStr.includes('may') || datesStr.includes('june');
            break;
          case 'june-july':
            matchesDate = datesStr.includes('june') || datesStr.includes('july');
            break;
          case 'july-august':
            matchesDate = datesStr.includes('july') || datesStr.includes('august');
            break;
          default:
            matchesDate = true;
        }
      }

      // Age filter
      let matchesAge = true;
      if (ageFilter) {
        const selectedAge = parseInt(ageFilter);
        if (camp.ages) {
          const ageStr = camp.ages.toLowerCase();
          let campMinAge = null;
          let campMaxAge = null;

          // Try to extract age range
          const rangeMatch = ageStr.match(/(\d+)\s*[-–—]\s*(\d+)/);
          if (rangeMatch) {
            campMinAge = parseInt(rangeMatch[1]);
            campMaxAge = parseInt(rangeMatch[2]);
          } else if (ageStr.includes('+')) {
            const plusMatch = ageStr.match(/(\d+)\s*\+/);
            if (plusMatch) {
              campMinAge = parseInt(plusMatch[1]);
              campMaxAge = 18;
            }
          } else if (
            ageStr.includes('grade') ||
            ageStr.includes('k-') ||
            ageStr.includes('1st') ||
            ageStr.includes('2nd') ||
            ageStr.includes('3rd')
          ) {
            if (ageStr.includes('k')) {
              campMinAge = 5;
            }
            const gradeMatch = ageStr.match(/(\d+)(?:st|nd|rd|th)/);
            if (gradeMatch) {
              const grade = parseInt(gradeMatch[1]);
              if (!campMinAge) campMinAge = grade + 5;
              campMaxAge = grade + 5 + 1;
            } else if (ageStr.includes('k-')) {
              const kMatch = ageStr.match(/k\s*[-–—]\s*(\d+)/);
              if (kMatch) {
                campMinAge = 5;
                campMaxAge = parseInt(kMatch[1]) + 5;
              }
            }
          } else {
            const singleMatch = ageStr.match(/(\d+)/);
            if (singleMatch) {
              const campAge = parseInt(singleMatch[1]);
              campMinAge = campAge;
              campMaxAge = campAge + 5;
            }
          }

          if (campMinAge !== null) {
            matchesAge =
              selectedAge >= campMinAge &&
              (campMaxAge === null || selectedAge <= campMaxAge);
          } else {
            matchesAge = false;
          }
        } else {
          matchesAge = false;
        }
      }

      return matchesSearch && matchesDistrict && matchesType && matchesAge && matchesCost && matchesDate;
    });
  }, [camps, searchTerm, ageFilter, typeFilter, districtFilter, costFilter, dateFilter]);

  return filteredCamps;
}

// Helper function to extract cost from string
function extractCost(costStr) {
  // Try to find dollar amounts like $100, $200/week, etc.
  const match = costStr.match(/\$(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  // Check for free
  if (costStr.includes('free')) {
    return 0;
  }
  return null;
}
