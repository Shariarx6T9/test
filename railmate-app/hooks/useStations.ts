import { useQuery } from '@tanstack/react-query';
import { getAllStations } from '../api/stations';
import { Station } from '../types/station.types';

// Major Bangladesh Railway stations as offline fallback.
// Field shape matches the real deployed `stations` schema (numeric id,
// shohoz_city as the join key into trains.origin_city/destination_city).
const FALLBACK_STATIONS: Station[] = [
  { id: 1,  code: 'DHKA', name_en: 'Dhaka (Kamalapur)', name_bn: 'ঢাকা (কমলাপুর)', division: 'Dhaka',      shohoz_city: 'DHAKA',      is_intercity_hub: true  },
  { id: 2,  code: 'CTG',  name_en: 'Chattogram',        name_bn: 'চট্টগ্রাম',     division: 'Chittagong', shohoz_city: 'CHATTOGRAM', is_intercity_hub: true  },
  { id: 3,  code: 'SYT',  name_en: 'Sylhet',             name_bn: 'সিলেট',         division: 'Sylhet',     shohoz_city: 'SYLHET',     is_intercity_hub: true  },
  { id: 4,  code: 'RAJ',  name_en: 'Rajshahi',           name_bn: 'রাজশাহী',       division: 'Rajshahi',   shohoz_city: 'RAJSHAHI',   is_intercity_hub: true  },
  { id: 5,  code: 'KHU',  name_en: 'Khulna',              name_bn: 'খুলনা',         division: 'Khulna',     shohoz_city: 'KHULNA',     is_intercity_hub: true  },
  { id: 6,  code: 'MYM',  name_en: 'Mymensingh',          name_bn: 'ময়মনসিংহ',     division: 'Mymensingh', shohoz_city: 'MYMENSINGH', is_intercity_hub: true  },
  { id: 7,  code: 'COM',  name_en: 'Comilla',             name_bn: 'কুমিল্লা',      division: 'Chittagong', shohoz_city: 'COMILLA',    is_intercity_hub: false },
  { id: 8,  code: 'NSD',  name_en: 'Narsingdi',           name_bn: 'নরসিংদী',       division: 'Dhaka',      shohoz_city: 'DHAKA',      is_intercity_hub: false },
  { id: 9,  code: 'AKH',  name_en: 'Akhaura',             name_bn: 'আখাউড়া',       division: 'Chittagong', shohoz_city: 'CHATTOGRAM', is_intercity_hub: false },
  { id: 10, code: 'JDP',  name_en: 'Joydebpur',           name_bn: 'জয়দেবপুর',     division: 'Dhaka',      shohoz_city: 'DHAKA',      is_intercity_hub: false },
  { id: 11, code: 'NRG',  name_en: 'Narayanganj',         name_bn: 'নারায়ণগঞ্জ',   division: 'Dhaka',      shohoz_city: 'DHAKA',      is_intercity_hub: false },
  { id: 12, code: 'IWD',  name_en: 'Ishwardi',            name_bn: 'ঈশ্বরদী',       division: 'Rajshahi',   shohoz_city: 'RAJSHAHI',   is_intercity_hub: false },
  { id: 13, code: 'PBP',  name_en: 'Parbatipur',          name_bn: 'পার্বতীপুর',    division: 'Rangpur',    shohoz_city: 'RANGPUR',    is_intercity_hub: false },
  { id: 14, code: 'JS',   name_en: 'Jessore',             name_bn: 'যশোর',          division: 'Khulna',     shohoz_city: 'KHULNA',     is_intercity_hub: false },
  { id: 15, code: 'RNG',  name_en: 'Rangpur',             name_bn: 'রংপুর',         division: 'Rangpur',    shohoz_city: 'RANGPUR',    is_intercity_hub: false },
  { id: 16, code: 'BOG',  name_en: 'Bogura',              name_bn: 'বগুড়া',         division: 'Rajshahi',   shohoz_city: 'RAJSHAHI',   is_intercity_hub: false },
  { id: 17, code: 'DNJ',  name_en: 'Dinajpur',            name_bn: 'দিনাজপুর',      division: 'Rangpur',    shohoz_city: 'RANGPUR',    is_intercity_hub: false },
];

export const useStations = () =>
  useQuery({
    queryKey: ['stations'],
    queryFn: async (): Promise<Station[]> => {
      try {
        const data = await getAllStations();
        if (data && data.length > 0) return data;
        return FALLBACK_STATIONS;
      } catch {
        return FALLBACK_STATIONS;
      }
    },
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

export { FALLBACK_STATIONS };
