import { useQuery } from '@tanstack/react-query';
import { getAllStations } from '../api/stations';
import { Station } from '../types/station.types';

// Major Bangladesh Railway stations as offline fallback
const FALLBACK_STATIONS: Station[] = [
  { id: 'dhaka',       name_en: 'Dhaka',       name_bn: 'ঢাকা',       code: 'DAK',  zone: 'Dhaka',     is_junction: true,  is_active: true, latitude: 23.7104, longitude: 90.4074 },
  { id: 'chattogram',  name_en: 'Chattogram',   name_bn: 'চট্টগ্রাম',   code: 'CTG',  zone: 'Chattogram', is_junction: true,  is_active: true, latitude: 22.3475, longitude: 91.8123 },
  { id: 'sylhet',      name_en: 'Sylhet',       name_bn: 'সিলেট',       code: 'SYL',  zone: 'Dhaka',     is_junction: true,  is_active: true, latitude: 24.8949, longitude: 91.8687 },
  { id: 'rajshahi',    name_en: 'Rajshahi',     name_bn: 'রাজশাহী',     code: 'RJH',  zone: 'Rajshahi',  is_junction: true,  is_active: true, latitude: 24.3636, longitude: 88.6241 },
  { id: 'khulna',      name_en: 'Khulna',       name_bn: 'খুলনা',       code: 'KHN',  zone: 'Khulna',    is_junction: true,  is_active: true, latitude: 22.8456, longitude: 89.5403 },
  { id: 'mymensingh',  name_en: 'Mymensingh',   name_bn: 'ময়মনসিংহ',   code: 'MYM',  zone: 'Dhaka',     is_junction: true,  is_active: true, latitude: 24.7471, longitude: 90.4203 },
  { id: 'comilla',     name_en: 'Comilla',      name_bn: 'কুমিল্লা',    code: 'COM',  zone: 'Chattogram', is_junction: false, is_active: true, latitude: 23.4607, longitude: 91.1809 },
  { id: 'narsingdi',   name_en: 'Narsingdi',    name_bn: 'নরসিংদী',     code: 'NRS',  zone: 'Dhaka',     is_junction: false, is_active: true, latitude: 23.9223, longitude: 90.7152 },
  { id: 'brahmanbaria',name_en: 'Brahmanbaria', name_bn: 'ব্রাহ্মণবাড়িয়া',code: 'BRB', zone: 'Chattogram', is_junction: false, is_active: true, latitude: 23.9608, longitude: 91.1115 },
  { id: 'joydebpur',   name_en: 'Joydebpur',    name_bn: 'জয়দেবপুর',    code: 'JDP',  zone: 'Dhaka',     is_junction: true,  is_active: true, latitude: 23.9999, longitude: 90.4118 },
  { id: 'narayanganj', name_en: 'Narayanganj',  name_bn: 'নারায়ণগঞ্জ', code: 'NRJ',  zone: 'Dhaka',     is_junction: false, is_active: true, latitude: 23.6238, longitude: 90.4996 },
  { id: 'ishwardi',    name_en: 'Ishwardi',     name_bn: 'ঈশ্বরদী',     code: 'ISW',  zone: 'Rajshahi',  is_junction: true,  is_active: true, latitude: 24.1299, longitude: 89.0672 },
  { id: 'parbatipur',  name_en: 'Parbatipur',   name_bn: 'পার্বতীপুর',  code: 'PBP',  zone: 'Rajshahi',  is_junction: true,  is_active: true, latitude: 25.6516, longitude: 88.9121 },
  { id: 'jessore',     name_en: 'Jessore',      name_bn: 'যশোর',        code: 'JSR',  zone: 'Khulna',    is_junction: false, is_active: true, latitude: 23.1664, longitude: 89.2122 },
  { id: 'rangpur',     name_en: 'Rangpur',      name_bn: 'রংপুর',       code: 'RGP',  zone: 'Rajshahi',  is_junction: false, is_active: true, latitude: 25.7439, longitude: 89.2752 },
  { id: 'bogura',      name_en: 'Bogura',       name_bn: 'বগুড়া',       code: 'BOG',  zone: 'Rajshahi',  is_junction: false, is_active: true, latitude: 24.8465, longitude: 89.3720 },
  { id: 'dinajpur',    name_en: 'Dinajpur',     name_bn: 'দিনাজপুর',    code: 'DNJ',  zone: 'Rajshahi',  is_junction: false, is_active: true, latitude: 25.6279, longitude: 88.6338 },
  { id: 'feni',        name_en: 'Feni',         name_bn: 'ফেনী',        code: 'FNI',  zone: 'Chattogram', is_junction: false, is_active: true, latitude: 23.0153, longitude: 91.3976 },
  { id: 'laksham',     name_en: 'Laksham',      name_bn: 'লাকসাম',      code: 'LKS',  zone: 'Chattogram', is_junction: true,  is_active: true, latitude: 23.2378, longitude: 91.1315 },
  { id: 'akhaura',     name_en: 'Akhaura',      name_bn: 'আখাউড়া',     code: 'AKH',  zone: 'Chattogram', is_junction: true,  is_active: true, latitude: 23.8792, longitude: 91.2000 },
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
