-- ============================================================
-- RailMate Bangladesh — Seed Data
-- Run AFTER migrations.
-- ============================================================

-- STATIONS
INSERT INTO stations (id, code, name_en, name_bn, division, zone, is_major, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'DHK', 'Dhaka (Kamalapur)',   'ঢাকা (কমলাপুর)', 'Dhaka',      'East', true, true),
  ('a1000000-0000-0000-0000-000000000002', 'CTG', 'Chittagong',          'চট্টগ্রাম',       'Chittagong', 'East', true, true),
  ('a1000000-0000-0000-0000-000000000003', 'COM', 'Comilla',             'কুমিল্লা',        'Chittagong', 'East', true, true),
  ('a1000000-0000-0000-0000-000000000004', 'NAR', 'Narsingdi',           'নরসিংদী',        'Dhaka',      'East', false, true),
  ('a1000000-0000-0000-0000-000000000005', 'AKH', 'Akhaura',             'আখাউড়া',        'Chittagong', 'East', false, true),
  ('a1000000-0000-0000-0000-000000000006', 'SYL', 'Sylhet',              'সিলেট',           'Sylhet',     'East', true, true),
  ('a1000000-0000-0000-0000-000000000007', 'RJH', 'Rajshahi',            'রাজশাহী',        'Rajshahi',   'West', true, true),
  ('a1000000-0000-0000-0000-000000000008', 'KHL', 'Khulna',              'খুলনা',           'Khulna',     'West', true, true),
  ('a1000000-0000-0000-0000-000000000009', 'MYM', 'Mymensingh',          'ময়মনসিংহ',      'Dhaka',      'East', true, true),
  ('a1000000-0000-0000-0000-000000000010', 'BBR', 'Brahmanbaria',        'ব্রাহ্মণবাড়িয়া', 'Chittagong', 'East', false, true);

-- TRAINS
INSERT INTO trains (id, number, name_en, name_bn, type, origin_id, destination_id, days_of_week, is_active, last_verified) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    '721',
    'Subarna Express',
    'সুবর্ণ এক্সপ্রেস',
    'Intercity',
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    ARRAY[0,1,2,3,4,5,6]::SMALLINT[],
    true,
    '2026-01-15'
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    '787',
    'Sonar Bangla Express',
    'সোনার বাংলা এক্সপ্রেস',
    'Intercity',
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    ARRAY[0,1,2,3,4,6]::SMALLINT[],  -- No Friday
    true,
    '2026-01-15'
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    '4',
    'Turna Express',
    'তূর্ণা এক্সপ্রেস',
    'Intercity',
    'a1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    ARRAY[0,1,2,3,4,5,6]::SMALLINT[],
    true,
    '2026-01-15'
  );

-- TRAIN STOPS — Subarna Express #721 (Dhaka → Chittagong)
INSERT INTO train_stops (train_id, station_id, sequence, arrival_time, departure_time, halt_minutes, is_major_stop) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 1,  NULL,    '06:40', 0,  true),
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 2,  '07:20', '07:22', 2,  false),
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 3,  '08:30', '08:40', 10, true),
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 4,  '09:15', '09:20', 5,  false),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 5,  '11:15', NULL,    0,  true);

-- TRAIN STOPS — Sonar Bangla Express #787 (Dhaka → Chittagong)
INSERT INTO train_stops (train_id, station_id, sequence, arrival_time, departure_time, halt_minutes, is_major_stop) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 1,  NULL,    '07:00', 0,  true),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 2,  '08:45', '08:50', 5,  true),
  ('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 3,  '12:00', NULL,    0,  true);

-- TRAIN STOPS — Turna Express #4 (Dhaka → Chittagong — night service)
INSERT INTO train_stops (train_id, station_id, sequence, arrival_time, departure_time, halt_minutes, is_major_stop) VALUES
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 1,  NULL,    '23:00', 0,  true),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 2,  '01:00', '01:10', 10, true),
  ('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 3,  '04:00', NULL,    0,  true);

-- FARES (Dhaka → Chittagong, applies to all trains unless overridden)
INSERT INTO fares (train_id, from_station_id, to_station_id, class, price_bdt, last_verified) VALUES
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'SHOVON',       215,  '2026-01-15'),
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'SHOVON_CHAIR', 345,  '2026-01-15'),
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'SNIGDHA',      655,  '2026-01-15'),
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'AC_S_CHAIR',   780,  '2026-01-15'),
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'AC_BERTH',     1320, '2026-01-15'),
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'FIRST_BERTH',  860,  '2026-01-15'),
  (NULL, 'a1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'FIRST_SEAT',   510,  '2026-01-15');
