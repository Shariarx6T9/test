-- ============================================================
-- RailMate Bangladesh — Seed Data
-- ============================================================

-- Clear existing data
TRUNCATE TABLE fares CASCADE;
TRUNCATE TABLE train_stops CASCADE;
TRUNCATE TABLE trains CASCADE;
TRUNCATE TABLE stations CASCADE;

-- 1. STATIONS
-- Unique stations extracted from trains.json and train_stops.json
INSERT INTO stations (code, name_en, name_bn, is_major) VALUES
('DHKA', 'DHAKA', 'ঢাকা', true),
('DABB', 'DHAKA AIRPORT', 'ঢাকা বিমানবন্দর', true),
('CTG', 'CHATTOGRAM', 'চট্টগ্রাম', true),
('COM', 'COMILLA', 'কুমিল্লা', true),
('AKH', 'AKHAURA', 'আখাউড়া', false),
('BBZ', 'BHAIRAB BAZAR', 'ভৈরব বাজার', false),
('NSD', 'NARSINGDI', 'নরসিংদী', false),
('SRM', 'SREEMANGAL', 'শ্রীমঙ্গল', false),
('SYT', 'SYLHET', 'সিলেট', true),
('TNG', 'TONGI', 'টঙ্গী', false),
('IWD', 'ISHWARDI', 'ঈশ্বরদী', true),
('STH', 'SANTAHAR', 'সান্তাহার', true),
('BOG', 'BOGURA', 'বগুড়া', true),
('PBP', 'PARBATIPUR', 'পার্বতীপুর', true),
('LMH', 'LALMONIRHAT', 'লালমনিরহাট', true),
('JS', 'JASHORE', 'যশোর', true),
('KHU', 'KHULNA', 'খুলনা', true),
('RJHI', 'RAJSHAHI', 'রাজশাহী', true),
('PANCH', 'PANCHAGARH', 'পঞ্চগড়', true),
('CNG', 'CHAPAINAWABGANJ', 'চাঁপাইনবাবগঞ্জ', true),
('BENO', 'BENAPOLE', 'বেনাপোল', true),
('JAM', 'JAMALPUR', 'জামালপুর', true),
('BURI', 'BURIMARI', 'বুড়িমারী', true),
('CHND', 'CHANDPUR', 'চাঁদপুর', true),
('CHIL', 'CHILAHATI', 'চিলাহাটি', true),
('COXB', 'COX''S BAZAR', 'কক্সবাজার', true),
('DHAL', 'DHALARCHAR', 'ঢালারচর', true),
('MYM', 'MYMENSINGH', 'ময়মনসিংহ', true),
('KISH', 'KISHOREGANJ', 'কিশোরগঞ্জ', true),
('MOHO', 'MOHONGANJ', 'মোহনগঞ্জ', true),
('NARA', 'NARAYANGANJ', 'নারায়ণগঞ্জ', true),
('KURI', 'KURIGRAM', 'কুড়িগ্রাম', true),
('RNGP', 'RANGPUR', 'রংপুর', true),
('SIRJ', 'SIRAJGANJ', 'সিরাজগঞ্জ', true),
('NOA', 'NOAKHALI', 'নোয়াখালী', true);

-- 2. TRAINS
-- Mapping intercity trains from trains.json
-- days_of_week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
INSERT INTO trains (number, name_en, name_bn, type, origin_id, destination_id, days_of_week) VALUES
('735', 'Aghnibina Express', 'অগ্নিবীণা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'SYT'), ARRAY[0,1,2,3,4,6]),
('736', 'Aghnibina Express', 'অগ্নিবীণা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'SYT'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,3,4,6]),
('791', 'Banalata Express', 'বনলতা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'RJHI'), ARRAY[0,1,3,4,5,6]),
('792', 'Banalata Express', 'বনলতা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'RJHI'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,4,5,6]),
('803', 'Banglabandha Express', 'বাংলাবান্ধা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'PANCH'), ARRAY[1,2,3,4,5,6]),
('804', 'Banglabandha Express', 'বাংলাবান্ধা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'PANCH'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,2,3,4,5,6]),
('813', 'Cox''s Bazar Express', 'কক্সবাজার এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'COXB'), ARRAY[0,1,3,4,5,6]),
('814', 'Cox''s Bazar Express', 'কক্সবাজার এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'COXB'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,4,5,6]),
('787', 'Sonar Bangla Express', 'সোনার বাংলা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), ARRAY[0,1,3,4,5,6]),
('788', 'Sonar Bangla Express', 'সোনার বাংলা এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'CTG'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,4,5,6]),
('701', 'Suborno Express', 'সুবর্ণ এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), ARRAY[0,1,2,3,4,6]),
('702', 'Suborno Express', 'সুবর্ণ এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'CTG'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,3,4,6]),
('741', 'Turna', 'তূর্ণা', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), ARRAY[0,1,2,3,4,6]),
('742', 'Turna', 'তূর্ণা', 'Intercity', (SELECT id FROM stations WHERE code = 'CTG'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,3,4,6]),
('725', 'Sundarban Express', 'সুন্দরবন এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'KHU'), ARRAY[0,1,2,4,5,6]),
('726', 'Sundarban Express', 'সুন্দরবন এক্সপ্রেস', 'Intercity', (SELECT id FROM stations WHERE code = 'KHU'), (SELECT id FROM stations WHERE code = 'DHKA'), ARRAY[0,1,2,3,5,6]);

-- 3. TRAIN STOPS
-- Mapping detailed stops from train_stops.json
INSERT INTO train_stops (train_id, station_id, sequence, arrival_time, departure_time, is_major_stop) VALUES
-- Sonar Bangla Express (787)
((SELECT id FROM trains WHERE number = '787'), (SELECT id FROM stations WHERE code = 'DHKA'), 1, NULL, '07:00:00', true),
((SELECT id FROM trains WHERE number = '787'), (SELECT id FROM stations WHERE code = 'DABB'), 2, '07:20:00', '07:22:00', true),
((SELECT id FROM trains WHERE number = '787'), (SELECT id FROM stations WHERE code = 'CTG'), 3, '11:55:00', NULL, true),

-- Sonar Bangla Express (788)
((SELECT id FROM trains WHERE number = '788'), (SELECT id FROM stations WHERE code = 'CTG'), 1, NULL, '15:00:00', true),
((SELECT id FROM trains WHERE number = '788'), (SELECT id FROM stations WHERE code = 'DABB'), 2, '19:38:00', '19:40:00', true),
((SELECT id FROM trains WHERE number = '788'), (SELECT id FROM stations WHERE code = 'DHKA'), 3, '19:55:00', NULL, true),

-- Sundarban Express (725)
((SELECT id FROM trains WHERE number = '725'), (SELECT id FROM stations WHERE code = 'DHKA'), 1, NULL, '06:20:00', true),
((SELECT id FROM trains WHERE number = '725'), (SELECT id FROM stations WHERE code = 'DABB'), 2, '06:40:00', '06:42:00', true),
((SELECT id FROM trains WHERE number = '725'), (SELECT id FROM stations WHERE code = 'TNG'), 3, '07:05:00', '07:08:00', false),
((SELECT id FROM trains WHERE number = '725'), (SELECT id FROM stations WHERE code = 'IWD'), 4, '10:40:00', '10:50:00', true),
((SELECT id FROM trains WHERE number = '725'), (SELECT id FROM stations WHERE code = 'JS'), 5, '13:05:00', '13:10:00', true),
((SELECT id FROM trains WHERE number = '725'), (SELECT id FROM stations WHERE code = 'KHU'), 6, '14:50:00', NULL, true);

-- 4. SAMPLE FARES
-- Mapping sample fares from fares.json
INSERT INTO fares (from_station_id, to_station_id, class, price_bdt) VALUES
-- Dhaka to Chattogram
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), 'SHOVON_CHAIR', 350),
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), 'SNIGDHA', 672),
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), 'AC_BERTH', 1447),
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'CTG'), 'AC_SEAT', 1050),

-- Dhaka to Khulna
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'KHU'), 'SHOVON_CHAIR', 430),
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'KHU'), 'SNIGDHA', 826),
((SELECT id FROM stations WHERE code = 'DHKA'), (SELECT id FROM stations WHERE code = 'KHU'), 'AC_BERTH', 1780);
