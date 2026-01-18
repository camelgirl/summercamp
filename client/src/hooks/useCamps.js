import { useState, useEffect, useMemo } from 'react';

export function useCamps(apiEndpoint) {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoint);
        if (!response.ok) throw new Error('Failed to fetch camps');
        const data = await response.json();
        setCamps(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading camps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, [apiEndpoint]);

  return { camps, loading, error };
}

export function useFilteredCamps(camps, filters) {
  const { searchTerm, ageFilter, typeFilter, districtFilter } = filters;

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

      return matchesSearch && matchesDistrict && matchesType && matchesAge;
    });
  }, [camps, searchTerm, ageFilter, typeFilter, districtFilter]);

  return filteredCamps;
}
