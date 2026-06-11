-- ============================================================
-- RailMate Bangladesh — Supabase Seed Data
-- ============================================================
-- Last Updated: 2026-06-10
-- Run AFTER schema.sql
-- ============================================================

-- ------------------------------------------------------------
-- SEAT CLASSES (10 rows)
-- ------------------------------------------------------------
INSERT INTO seat_classes (id, code, name_en, name_bn, category, has_ac, has_berth, comfort_level, description, booking_available) VALUES
  (1, 'S_CHAIR', 'Shovan Chair', 'শোভন চেয়ার', 'non_ac', FALSE, FALSE, 2, 'Non-AC reserved seat. Most common class on intercity trains. Forward-facing seats with basic comfort.', TRUE),
  (2, 'SHOVAN', 'Shovan', 'শোভন', 'non_ac', FALSE, FALSE, 1, 'Non-AC unreserved or lower-class seat. Basic bench seating. Cheapest class available.', TRUE),
  (3, 'SNIGDHA', 'Snigdha', 'স্নিগ্ধা', 'ac', TRUE, FALSE, 4, 'AC chair class. Air-conditioned reclining seats. Premium day travel option on intercity trains.', TRUE),
  (4, 'F_SEAT', 'First Class Seat', 'প্রথম শ্রেণীর আসন', 'non_ac', FALSE, FALSE, 3, 'First class non-AC seat. Better seats than Shovan Chair with more legroom. Available on select trains.', TRUE),
  (5, 'F_CHAIR', 'First Class Chair', 'প্রথম শ্রেণীর চেয়ার', 'non_ac', FALSE, FALSE, 3, 'First class chair. Similar to F_SEAT on some train configurations.', TRUE),
  (6, 'AC_S', 'AC Seat', 'এসি আসন', 'ac', TRUE, FALSE, 4, 'AC reserved seat. Air-conditioned compartment with assigned seating. Mid-range premium option.', TRUE),
  (7, 'F_BERTH', 'First Class Berth', 'প্রথম শ্রেণীর বার্থ', 'non_ac', FALSE, TRUE, 3, 'First class non-AC sleeping berth. For overnight journeys. Fold-down berths in cabin compartments.', TRUE),
  (8, 'AC_B', 'AC Berth', 'এসি বার্থ', 'ac', TRUE, TRUE, 5, 'AC sleeping berth. Highest comfort class. Air-conditioned sleeping cabins for overnight travel. Most expensive class.', TRUE),
  (9, 'SHULOV', 'Shulov', 'সুলভ', 'non_ac', FALSE, FALSE, 1, 'Economy class. Very basic seating. Available on local and some mail/express trains. Lowest fare.', TRUE),
  (10, 'AC_CHAIR', 'AC Chair', 'এসি চেয়ার', 'ac', TRUE, FALSE, 4, 'AC Chair class. Air-conditioned reserved seating. Equivalent to Snigdha on many trains. Available on premium intercity routes.', TRUE);

-- ------------------------------------------------------------
-- STATIONS (52 rows)
-- ------------------------------------------------------------
INSERT INTO stations (id, name_en, name_bn, code, shohoz_city, zone, division, gauge, lat, lng, is_intercity_hub, station_class, note) VALUES
  (1, 'Dhaka (Kamalapur)', 'ঢাকা (কমলাপুর)', 'DHKA', 'DHAKA', 'East', 'Dhaka', 'Dual', 23.7332, 90.4272, TRUE, 'A', NULL),
  (2, 'Dhaka Airport', 'ঢাকা বিমানবন্দর', 'DABB', 'DHAKA AIRPORT', 'East', 'Dhaka', 'Dual', 23.8522, 90.4083, FALSE, 'B', NULL),
  (3, 'Dhaka Cantonment', 'ঢাকা ক্যান্টনমেন্ট', 'DHCA', 'DHAKA CANTONMENT', 'East', 'Dhaka', 'Dual', 23.8155, 90.4106, FALSE, 'B', 'International terminus — Maitree Express & Mitali Express to India'),
  (4, 'Banani', 'বনানী', 'BNNI', 'BANANI', 'East', 'Dhaka', 'Dual', 23.7957, 90.4008, FALSE, 'C', NULL),
  (5, 'Tejgaon', 'তেজগাঁও', 'TJG', 'TEJGAON', 'East', 'Dhaka', 'Dual', 23.7676, 90.3896, FALSE, 'C', NULL),
  (6, 'Tongi', 'টঙ্গী', 'TNG', 'TONGI', 'East', 'Dhaka', 'Dual', 23.8973, 90.3994, FALSE, 'B', NULL),
  (7, 'Joydebpur', 'জয়দেবপুর', 'JDP', 'JOYDEBPUR', 'East', 'Dhaka', 'Dual', 23.9999, 90.4011, FALSE, 'B', NULL),
  (8, 'Narsingdi', 'নরসিংদী', 'NSD', 'NARSINGDI', 'East', 'Dhaka', 'Meter', 23.9215, 90.7139, FALSE, 'B', NULL),
  (9, 'Bhairab Bazar', 'ভৈরব বাজার', 'BBZ', 'BHAIRAB BAZAR', 'East', 'Dhaka', 'Meter', 24.0528, 90.9736, FALSE, 'B', NULL),
  (10, 'Narayanganj', 'নারায়ণগঞ্জ', 'NRG', 'NARAYANGANJ', 'East', 'Dhaka', 'Meter', 23.6238, 90.4996, FALSE, 'B', NULL),
  (11, 'Chattogram', 'চট্টগ্রাম', 'CTG', 'CHATTOGRAM', 'East', 'Chittagong', 'Meter', 22.3384, 91.8317, TRUE, 'A', NULL),
  (12, 'Comilla', 'কুমিল্লা', 'COM', 'COMILLA', 'East', 'Chittagong', 'Meter', 23.4607, 91.1809, FALSE, 'B', NULL),
  (13, 'Akhaura', 'আখাউড়া', 'AKH', 'AKHAURA', 'East', 'Chittagong', 'Meter', 23.8842, 91.1497, FALSE, 'B', 'Junction for Sylhet and Chittagong lines'),
  (14, 'Laksam', 'লাকসাম', 'LKS', 'LAKSAM', 'East', 'Chittagong', 'Meter', 23.2481, 91.1367, FALSE, 'B', NULL),
  (15, 'Noakhali', 'নোয়াখালী', 'NOA', 'NOAKHALI', 'East', 'Chittagong', 'Meter', 22.8696, 91.0996, FALSE, 'B', NULL),
  (16, 'Chandpur', 'চাঁদপুর', 'CDP', 'CHANDPUR', 'East', 'Chittagong', 'Meter', 23.2332, 90.6518, FALSE, 'B', NULL),
  (17, 'Cox''s Bazar', 'কক্সবাজার', 'CXBZ', 'COX''S BAZAR', 'East', 'Chittagong', 'Meter', 21.4272, 92.0058, FALSE, 'B', 'Newly opened 2023 — served by Cox''s Bazar Express 813/814'),
  (18, 'Sylhet', 'সিলেট', 'SYT', 'SYLHET', 'East', 'Sylhet', 'Meter', 24.8949, 91.8687, TRUE, 'A', NULL),
  (19, 'Sreemangal', 'শ্রীমঙ্গল', 'SRM', 'SREEMANGAL', 'East', 'Sylhet', 'Meter', 24.3068, 91.7279, FALSE, 'B', NULL),
  (20, 'Kulaura', 'কুলাউড়া', 'KLR', 'KULAURA', 'East', 'Sylhet', 'Meter', 24.5358, 92.0356, FALSE, 'C', NULL),
  (21, 'Kishoreganj', 'কিশোরগঞ্জ', 'KSG', 'KISHOREGANJ', 'East', 'Dhaka', 'Meter', 24.4449, 90.782, FALSE, 'B', NULL),
  (22, 'Mymensingh', 'ময়মনসিংহ', 'MYM', 'MYMENSINGH', 'East', 'Mymensingh', 'Meter', 24.7471, 90.4073, TRUE, 'A', NULL),
  (23, 'Jamalpur', 'জামালপুর', 'JMP', 'JAMALPUR', 'East', 'Mymensingh', 'Meter', 24.9004, 89.9433, FALSE, 'B', NULL),
  (24, 'Netrokona', 'নেত্রকোণা', 'NTK', 'NETROKONA', 'East', 'Mymensingh', 'Meter', 24.8803, 90.8674, FALSE, 'B', NULL),
  (25, 'Rajshahi', 'রাজশাহী', 'RAJ', 'RAJSHAHI', 'West', 'Rajshahi', 'Broad', 24.3749, 88.6048, TRUE, 'A', NULL),
  (26, 'Natore', 'নাটোর', 'NTR', 'NATORE', 'West', 'Rajshahi', 'Broad', 24.4203, 88.9922, FALSE, 'B', NULL),
  (27, 'Ishwardi', 'ঈশ্বরদী', 'IWD', 'ISHWARDI', 'West', 'Rajshahi', 'Broad', 24.1302, 89.0611, FALSE, 'B', 'Major junction — East-West crossing point'),
  (28, 'Santahar', 'সান্তাহার', 'STH', 'SANTAHAR', 'West', 'Rajshahi', 'Broad', 24.7573, 89.0391, FALSE, 'B', 'Major junction for Rangpur/Dinajpur lines'),
  (29, 'Bogura', 'বগুড়া', 'BOG', 'BOGURA', 'West', 'Rajshahi', 'Broad', 24.8466, 89.3773, FALSE, 'B', NULL),
  (30, 'Sirajganj', 'সিরাজগঞ্জ', 'SJG', 'SIRAJGANJ', 'West', 'Rajshahi', 'Broad', 24.4536, 89.7161, FALSE, 'B', NULL),
  (31, 'Joypurhat', 'জয়পুরহাট', 'JPH', 'JOYPURHAT', 'West', 'Rajshahi', 'Broad', 25.1006, 89.0189, FALSE, 'B', NULL),
  (32, 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'CPN', 'CHAPAINAWABGANJ', 'West', 'Rajshahi', 'Broad', 24.5948, 88.2773, FALSE, 'B', NULL),
  (33, 'Parbatipur', 'পার্বতীপুর', 'PBP', 'PARBATIPUR', 'West', 'Rangpur', 'Broad', 25.6476, 88.9002, FALSE, 'B', 'Junction — Rangpur/Dinajpur/Lalmonirhat lines'),
  (34, 'Dinajpur', 'দিনাজপুর', 'DNJ', 'DINAJPUR', 'West', 'Rangpur', 'Broad', 25.6279, 88.6337, FALSE, 'B', NULL),
  (35, 'Rangpur', 'রংপুর', 'RNG', 'RANGPUR', 'West', 'Rangpur', 'Broad', 25.7439, 89.2752, FALSE, 'B', NULL),
  (36, 'Lalmonirhat', 'লালমনিরহাট', 'LMH', 'LALMONIRHAT', 'West', 'Rangpur', 'Broad', 25.92, 89.448, FALSE, 'B', NULL),
  (37, 'Panchagarh', 'পঞ্চগড়', 'PCG', 'PANCHAGARH', 'West', 'Rangpur', 'Broad', 26.3393, 88.5493, FALSE, 'B', NULL),
  (38, 'Kurigram', 'কুড়িগ্রাম', 'KRG', 'KURIGRAM', 'West', 'Rangpur', 'Broad', 25.8033, 89.636, FALSE, 'B', NULL),
  (39, 'Chilahati', 'চিলাহাটি', 'CLH', 'CHILAHATI', 'West', 'Rangpur', 'Broad', 25.9913, 88.7742, FALSE, 'B', 'Border station — potential international link to India'),
  (40, 'Khulna', 'খুলনা', 'KHU', 'KHULNA', 'West', 'Khulna', 'Broad', 22.8456, 89.5403, TRUE, 'A', NULL),
  (41, 'Jessore (Jashore)', 'যশোর', 'JS', 'JASHORE', 'West', 'Khulna', 'Broad', 23.1543, 89.2086, FALSE, 'B', NULL),
  (42, 'Benapole', 'বেনাপোল', 'BNP', 'BENAPOLE', 'West', 'Khulna', 'Broad', 23.0113, 88.9307, FALSE, 'B', 'Border station — India-Bangladesh land port'),
  (43, 'Rupsha', 'রূপসা', 'RPS', 'RUPSHA', 'West', 'Khulna', 'Broad', 22.7786, 89.5584, FALSE, 'C', NULL),
  (44, 'Barisal', 'বরিশাল', 'BRL', 'BARISAL', 'West', 'Barisal', 'Broad', 22.701, 90.3535, FALSE, 'B', 'Planned — Padma Bridge rail link extension pending'),
  (45, 'Faridpur', 'ফরিদপুর', 'FRP', 'FARIDPUR', 'West', 'Dhaka', 'Broad', 23.607, 89.8429, FALSE, 'B', 'New Padma Bridge rail link station'),
  (46, 'Rajbari', 'রাজবাড়ী', 'RBR', 'RAJBARI', 'West', 'Dhaka', 'Broad', 23.7621, 89.6398, FALSE, 'B', NULL),
  (47, 'Tangail', 'টাঙ্গাইল', 'TGL', 'TANGAIL', 'East', 'Dhaka', 'Meter', 24.2512, 89.9167, FALSE, 'B', NULL),
  (48, 'Gazipur', 'গাজীপুর', 'GZP', 'GAZIPUR', 'East', 'Dhaka', 'Dual', 23.999, 90.4115, FALSE, 'B', NULL),
  (49, 'Gaibandha', 'গাইবান্ধা', 'GBD', 'GAIBANDHA', 'West', 'Rangpur', 'Broad', 25.3285, 89.5283, FALSE, 'B', NULL),
  (50, 'Pabna', 'পাবনা', 'PBN', 'PABNA', 'West', 'Rajshahi', 'Broad', 24.0064, 89.2372, FALSE, 'B', NULL),
  (51, 'Ullapara', 'উল্লাপাড়া', 'ULP', 'ULLAPARA', 'West', 'Rajshahi', 'Broad', 24.3301, 89.6024, FALSE, 'B', NULL),
  (52, 'Burimari', 'বুড়িমারী', 'BMR', 'BURIMARI', 'West', 'Rangpur', 'Broad', 25.8813, 89.3394, FALSE, 'B', 'Border station — India-Bangladesh land port');

-- ------------------------------------------------------------
-- TRAINS (133 rows)
-- NOTE: pair_number self-reference inserted in second pass
-- ------------------------------------------------------------
INSERT INTO trains (id, number, name, model, direction, train_type, gauge, off_days, origin_city, destination_city, confidence, note, is_active) VALUES
  (1, 735, 'Aghnibina Express', 'AGHNIBINA EXPRESS (735)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'SYLHET', 'high', NULL, TRUE),
  (2, 736, 'Aghnibina Express', 'AGHNIBINA EXPRESS (736)', 'up', 'intercity', 'meter', '{friday}', 'SYLHET', 'DHAKA', 'high', NULL, TRUE),
  (3, 791, 'Banalata Express', 'BANALATA EXPRESS (791)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'RAJSHAHI', 'high', NULL, TRUE),
  (4, 792, 'Banalata Express', 'BANALATA EXPRESS (792)', 'up', 'intercity', 'broad', '{wednesday}', 'RAJSHAHI', 'DHAKA', 'high', NULL, TRUE),
  (5, 803, 'Banglabandha Express', 'BANGLABANDHA EXPRESS (803)', 'down', 'intercity', 'broad', '{sunday}', 'DHAKA', 'PANCHAGARH', 'high', NULL, TRUE),
  (6, 804, 'Banglabandha Express', 'BANGLABANDHA EXPRESS (804)', 'up', 'intercity', 'broad', '{monday}', 'PANCHAGARH', 'DHAKA', 'high', NULL, TRUE),
  (7, 731, 'Barendra Express', 'BARENDRA EXPRESS (731)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'CHAPAINAWABGANJ', 'high', NULL, TRUE),
  (8, 732, 'Barendra Express', 'BARENDRA EXPRESS (732)', 'up', 'intercity', 'broad', '{thursday}', 'CHAPAINAWABGANJ', 'DHAKA', 'high', NULL, TRUE),
  (9, 795, 'Benapole Express', 'BENAPOLE EXPRESS (795)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'BENAPOLE', 'high', NULL, TRUE),
  (10, 796, 'Benapole Express', 'BENAPOLE EXPRESS (796)', 'up', 'intercity', 'broad', '{wednesday}', 'BENAPOLE', 'DHAKA', 'high', NULL, TRUE),
  (11, 785, 'Bijoy Express', 'BIJOY EXPRESS (785)', 'down', 'intercity', 'broad', '{sunday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (12, 786, 'Bijoy Express', 'BIJOY EXPRESS (786)', 'up', 'intercity', 'broad', '{monday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (13, 743, 'Brahmaputra Express', 'BHRAMMAPUTRA EXPRESS (743)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'JAMALPUR', 'high', NULL, TRUE),
  (14, 744, 'Brahmaputra Express', 'BHRAMMAPUTRA EXPRESS (744)', 'up', 'intercity', 'meter', '{friday}', 'JAMALPUR', 'DHAKA', 'high', NULL, TRUE),
  (15, 809, 'Burimari Express', 'BURIMARI EXPRESS (809)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'BURIMARI', 'high', NULL, TRUE),
  (16, 810, 'Burimari Express', 'BURIMARI EXPRESS (810)', 'up', 'intercity', 'broad', '{thursday}', 'BURIMARI', 'DHAKA', 'high', NULL, TRUE),
  (17, 1, 'Chandpur Eid Special', 'CHANDPUR EID SPL 1 (01)', 'down', 'special', 'meter', '{}', 'DHAKA', 'CHANDPUR', 'medium', 'Eid seasonal only', TRUE),
  (18, 109, 'Chapainawabganj Shuttle', 'CHAPAINAWABGANJ SHUTTLE (109)', 'down', 'commuter', 'broad', '{}', 'RAJSHAHI', 'CHAPAINAWABGANJ', 'high', NULL, TRUE),
  (19, 110, 'Chapainawabganj Shuttle', 'CHAPAINAWABGANJ SHUTTLE (110)', 'up', 'commuter', 'broad', '{}', 'CHAPAINAWABGANJ', 'RAJSHAHI', 'high', NULL, TRUE),
  (20, 801, 'Chattala Express', 'CHATTALA EXPRESS (801)', 'down', 'intercity', 'meter', '{wednesday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (21, 802, 'Chattala Express', 'CHATTALA EXPRESS (802)', 'up', 'intercity', 'meter', '{thursday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (22, 805, 'Chilahati Express', 'CHILAHATI EXPRESS (805)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'CHILAHATI', 'high', NULL, TRUE),
  (23, 806, 'Chilahati Express', 'CHILAHATI EXPRESS (806)', 'up', 'intercity', 'broad', '{wednesday}', 'CHILAHATI', 'DHAKA', 'high', NULL, TRUE),
  (24, 763, 'Chitra Express', 'CHITRA EXPRESS (763)', 'down', 'intercity', 'broad', '{friday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (25, 764, 'Chitra Express', 'CHITRA EXPRESS (764)', 'up', 'intercity', 'broad', '{saturday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (26, 813, 'Cox''s Bazar Express', 'COXS BAZAR EXPRESS (813)', 'down', 'intercity', 'meter', '{tuesday}', 'DHAKA', 'COX'S BAZAR', 'high', NULL, TRUE),
  (27, 814, 'Cox''s Bazar Express', 'COXS BAZAR EXPRESS (814)', 'up', 'intercity', 'meter', '{wednesday}', 'COX'S BAZAR', 'DHAKA', 'high', NULL, TRUE),
  (28, 769, 'Dhumketu Express', 'DHUMKETU EXPRESS (769)', 'down', 'intercity', 'broad', '{friday}', 'DHAKA', 'RAJSHAHI', 'high', NULL, TRUE),
  (29, 770, 'Dhumketu Express', 'DHUMKETU EXPRESS (770)', 'up', 'intercity', 'broad', '{saturday}', 'RAJSHAHI', 'DHAKA', 'high', NULL, TRUE),
  (30, 779, 'Dhalarchar Express', 'DHALARCHAR EXPRESS (779)', 'down', 'intercity', 'broad', '{thursday}', 'DHALARCHAR', 'CHAPAINAWABGANJ', 'high', NULL, TRUE),
  (31, 780, 'Dhalarchar Express', 'DHALARCHAR EXPRESS (780)', 'up', 'intercity', 'broad', '{wednesday}', 'CHAPAINAWABGANJ', 'DHALARCHAR', 'high', NULL, TRUE),
  (32, 767, 'Dolonchapa Express', 'DOLONCHAPA EXPRESS (767)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'MYMENSINGH', 'high', NULL, TRUE),
  (33, 768, 'Dolonchapa Express', 'DOLONCHAPA EXPRESS (768)', 'up', 'intercity', 'meter', '{saturday}', 'MYMENSINGH', 'DHAKA', 'high', NULL, TRUE),
  (34, 757, 'Drutojan Express', 'DRUTOJAN EXPRESS (757)', 'down', 'intercity', 'broad', '{monday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (35, 758, 'Drutojan Express', 'DRUTOJAN EXPRESS (758)', 'up', 'intercity', 'broad', '{tuesday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (36, 749, 'Egarosindhur Godhuli', 'EGAROSINDHUR GODHULI (749)', 'down', 'intercity', 'meter', '{sunday}', 'DHAKA', 'KISHOREGANJ', 'high', NULL, TRUE),
  (37, 750, 'Egarosindhur Godhuli', 'EGAROSINDHUR GODHULI (750)', 'up', 'intercity', 'meter', '{sunday}', 'KISHOREGANJ', 'DHAKA', 'high', NULL, TRUE),
  (38, 737, 'Egarosindhur Provati', 'EGAROSINDHUR PROVATI (737)', 'down', 'intercity', 'meter', '{sunday}', 'DHAKA', 'KISHOREGANJ', 'high', NULL, TRUE),
  (39, 738, 'Egarosindhur Provati', 'EGAROSINDHUR PROVATI (738)', 'up', 'intercity', 'meter', '{sunday}', 'KISHOREGANJ', 'DHAKA', 'high', NULL, TRUE),
  (40, 705, 'Ekota Express', 'EKOTA EXPRESS (705)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'PARBATIPUR', 'high', NULL, TRUE),
  (41, 706, 'Ekota Express', 'EKOTA EXPRESS (706)', 'up', 'intercity', 'broad', '{thursday}', 'PARBATIPUR', 'DHAKA', 'high', NULL, TRUE),
  (42, 777, 'Hawr Express', 'HAWR EXPRESS (777)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'MOHONGANJ', 'high', NULL, TRUE),
  (43, 778, 'Hawr Express', 'HAWR EXPRESS (778)', 'up', 'intercity', 'meter', '{saturday}', 'MOHONGANJ', 'DHAKA', 'high', NULL, TRUE),
  (44, 825, 'Jahanabad Express', 'JAHANABAD EXPRESS (825)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'KHULNA', 'medium', 'Verify stops — newly added', TRUE),
  (45, 826, 'Jahanabad Express', 'JAHANABAD EXPRESS (826)', 'up', 'intercity', 'broad', '{wednesday}', 'KHULNA', 'DHAKA', 'medium', NULL, TRUE),
  (46, 799, 'Jamalpur Express', 'JAMALPUR EXPRESS (799)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'JAMALPUR', 'high', NULL, TRUE),
  (47, 800, 'Jamalpur Express', 'JAMALPUR EXPRESS (800)', 'up', 'intercity', 'meter', '{friday}', 'JAMALPUR', 'DHAKA', 'high', NULL, TRUE),
  (48, 745, 'Jamuna Express', 'JAMUNA EXPRESS (745)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'JAMALPUR', 'high', NULL, TRUE),
  (49, 746, 'Jamuna Express', 'JAMUNA EXPRESS (746)', 'up', 'intercity', 'meter', '{friday}', 'JAMALPUR', 'DHAKA', 'high', NULL, TRUE),
  (50, 717, 'Jayantika Express', 'JAYENTIKA EXPRESS (717)', 'down', 'intercity', 'meter', '{wednesday}', 'DHAKA', 'SYLHET', 'high', NULL, TRUE),
  (51, 718, 'Jayantika Express', 'JAYENTIKA EXPRESS (718)', 'up', 'intercity', 'meter', '{thursday}', 'SYLHET', 'DHAKA', 'high', NULL, TRUE),
  (52, 773, 'Kalni Express', 'KALNI EXPRESS (773)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'BHAIRAB BAZAR', 'high', NULL, TRUE),
  (53, 774, 'Kalni Express', 'KALNI EXPRESS (774)', 'up', 'intercity', 'meter', '{friday}', 'BHAIRAB BAZAR', 'DHAKA', 'high', NULL, TRUE),
  (54, 41, 'Kanchon Intercity Commuter', 'KANCHON INTERCITY COMMUTER (41)', 'down', 'commuter', 'meter', '{}', 'DHAKA', 'NARAYANGANJ', 'high', NULL, TRUE),
  (55, 42, 'Kanchon Intercity Commuter', 'KANCHON INTERCITY COMMUTER (42)', 'up', 'commuter', 'meter', '{}', 'NARAYANGANJ', 'DHAKA', 'high', NULL, TRUE),
  (56, 715, 'Kapotaksha Express', 'KAPOTAKSHA EXPRESS (715)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (57, 716, 'Kapotaksha Express', 'KAPOTAKSHA EXPRESS (716)', 'up', 'intercity', 'broad', '{wednesday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (58, 781, 'Kishoreganj Express', 'KISHORGANJ EXPRESS (781)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'KISHOREGANJ', 'high', NULL, TRUE),
  (59, 782, 'Kishoreganj Express', 'KISHORGANJ EXPRESS (782)', 'up', 'intercity', 'meter', '{friday}', 'KISHOREGANJ', 'DHAKA', 'high', NULL, TRUE),
  (60, 713, 'Korotoa Express', 'KOROTOA EXPRESS (713)', 'down', 'intercity', 'broad', '{saturday}', 'DHAKA', 'LALMONIRHAT', 'high', NULL, TRUE),
  (61, 714, 'Korotoa Express', 'KOROTOA EXPRESS (714)', 'up', 'intercity', 'broad', '{sunday}', 'LALMONIRHAT', 'DHAKA', 'high', NULL, TRUE),
  (62, 797, 'Kurigram Express', 'KURIGRAM EXPRESS (797)', 'down', 'intercity', 'broad', '{thursday}', 'DHAKA', 'KURIGRAM', 'high', NULL, TRUE),
  (63, 798, 'Kurigram Express', 'KURIGRAM EXPRESS (798)', 'up', 'intercity', 'broad', '{friday}', 'KURIGRAM', 'DHAKA', 'high', NULL, TRUE),
  (64, 751, 'Lalmoni Express', 'LALMONI EXPRESS (751)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'LALMONIRHAT', 'high', NULL, TRUE),
  (65, 752, 'Lalmoni Express', 'LALMONI EXPRESS (752)', 'up', 'intercity', 'broad', '{wednesday}', 'LALMONIRHAT', 'DHAKA', 'high', NULL, TRUE),
  (66, 755, 'Madhumati Express', 'MADHUMATI EXPRESS (755)', 'down', 'intercity', 'broad', '{monday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (67, 756, 'Madhumati Express', 'MADHUMATI EXPRESS (756)', 'up', 'intercity', 'broad', '{tuesday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (68, 703, 'Mahanagar Godhuli', 'MAHANAGAR GODHULI (703)', 'up', 'intercity', 'meter', '{}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (69, 704, 'Mahanagar Provati', 'MAHANAGAR PROVATI (704)', 'down', 'intercity', 'meter', '{}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (70, 729, 'Meghna Express', 'MEGHNA EXPRESS (729)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (71, 730, 'Meghna Express', 'MEGHNA EXPRESS (730)', 'up', 'intercity', 'meter', '{friday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (72, 721, 'Mohanagar Express', 'MOHANAGAR EXPRESS (721)', 'down', 'intercity', 'broad', '{thursday}', 'DHAKA', 'RAJSHAHI', 'high', NULL, TRUE),
  (73, 722, 'Mohanagar Express', 'MOHANAGAR EXPRESS (722)', 'up', 'intercity', 'broad', '{friday}', 'RAJSHAHI', 'DHAKA', 'high', NULL, TRUE),
  (74, 789, 'Mohonganj Express', 'MOHONGANJ EXPRESS (789)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'MOHONGANJ', 'high', NULL, TRUE),
  (75, 790, 'Mohonganj Express', 'MOHONGANJ EXPRESS (790)', 'up', 'intercity', 'meter', '{friday}', 'MOHONGANJ', 'DHAKA', 'high', NULL, TRUE),
  (76, 765, 'Nilsagar Express', 'NILSAGAR EXPRESS (765)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'CHILAHATI', 'high', NULL, TRUE),
  (77, 766, 'Nilsagar Express', 'NILSAGAR EXPRESS (766)', 'up', 'intercity', 'broad', '{thursday}', 'CHILAHATI', 'DHAKA', 'high', NULL, TRUE),
  (78, 759, 'Padma Express', 'PADMA EXPRESS (759)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'RAJSHAHI', 'high', NULL, TRUE),
  (79, 760, 'Padma Express', 'PADMA EXPRESS (760)', 'up', 'intercity', 'broad', '{wednesday}', 'RAJSHAHI', 'DHAKA', 'high', NULL, TRUE),
  (80, 719, 'Paharika Express', 'PAHARIKA EXPRESS (719)', 'down', 'intercity', 'meter', '{thursday}', 'DHAKA', 'SYLHET', 'high', NULL, TRUE),
  (81, 720, 'Paharika Express', 'PAHARIKA EXPRESS (720)', 'up', 'intercity', 'meter', '{friday}', 'SYLHET', 'DHAKA', 'high', NULL, TRUE),
  (82, 793, 'Panchagarh Express', 'PANCHAGARH EXPRESS (793)', 'down', 'intercity', 'broad', '{saturday}', 'DHAKA', 'PANCHAGARH', 'high', NULL, TRUE),
  (83, 794, 'Panchagarh Express', 'PANCHAGARH EXPRESS (794)', 'up', 'intercity', 'broad', '{sunday}', 'PANCHAGARH', 'DHAKA', 'high', NULL, TRUE),
  (84, 709, 'Parabat Express', 'PARABAT EXPRESS (709)', 'down', 'intercity', 'meter', '{tuesday}', 'DHAKA', 'SYLHET', 'high', NULL, TRUE),
  (85, 710, 'Parabat Express', 'PARABAT EXPRESS (710)', 'up', 'intercity', 'meter', '{wednesday}', 'SYLHET', 'DHAKA', 'high', NULL, TRUE),
  (86, 9, 'Parbatipur Eid Special', 'PARBATIPUR EID SPL 9 (09)', 'down', 'special', 'broad', '{}', 'DHAKA', 'PARBATIPUR', 'medium', 'Eid seasonal only', TRUE),
  (87, 10, 'Parbatipur Eid Special', 'PARBATIPUR EID SPL 10 (10)', 'up', 'special', 'broad', '{}', 'PARBATIPUR', 'DHAKA', 'medium', 'Eid seasonal only', TRUE),
  (88, 815, 'Parjotak Express', 'PARJOTAK EXPRESS (815)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (89, 816, 'Parjotak Express', 'PARJOTAK EXPRESS (816)', 'up', 'intercity', 'meter', '{saturday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (90, 822, 'Probal Express', 'PROBAL EXPRESS (822)', 'down', 'intercity', 'meter', '{tuesday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (91, 823, 'Probal Express', 'PROBAL EXPRESS (823)', 'up', 'intercity', 'meter', '{wednesday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (92, 57, 'Rajshahi Commuter', 'RAJSHAHI COMMUTER (57)', 'down', 'commuter', 'broad', '{}', 'RAJSHAHI', 'ISHWARDI', 'high', NULL, TRUE),
  (93, 58, 'Rajshahi Commuter', 'RAJSHAHI COMMUTER (58)', 'up', 'commuter', 'broad', '{}', 'ISHWARDI', 'RAJSHAHI', 'high', NULL, TRUE),
  (94, 77, 'Rajshahi Commuter', 'RAJSHAHI COMMUTER (77)', 'down', 'commuter', 'broad', '{}', 'RAJSHAHI', 'ISHWARDI', 'high', NULL, TRUE),
  (95, 78, 'Rajshahi Commuter', 'RAJSHAHI COMMUTER (78)', 'up', 'commuter', 'broad', '{}', 'ISHWARDI', 'RAJSHAHI', 'high', NULL, TRUE),
  (96, 771, 'Rangpur Express', 'RANGPUR EXPRESS (771)', 'down', 'intercity', 'broad', '{friday}', 'DHAKA', 'RANGPUR', 'high', NULL, TRUE),
  (97, 772, 'Rangpur Express', 'RANGPUR EXPRESS (772)', 'up', 'intercity', 'broad', '{saturday}', 'RANGPUR', 'DHAKA', 'high', NULL, TRUE),
  (98, 827, 'Ruposhi Bangla Express', 'RUPOSHI BANGLA EXPRESS (827)', 'down', 'intercity', 'meter', '{tuesday}', 'DHAKA', 'CHATTOGRAM', 'medium', 'Newly added — verify stops', TRUE),
  (99, 828, 'Ruposhi Bangla Express', 'RUPOSHI BANGLA EXPRESS (828)', 'up', 'intercity', 'meter', '{wednesday}', 'CHATTOGRAM', 'DHAKA', 'medium', NULL, TRUE),
  (100, 727, 'Rupsha Express', 'RUPSHA EXPRESS (727)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (101, 728, 'Rupsha Express', 'RUPSHA EXPRESS (728)', 'up', 'intercity', 'broad', '{thursday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (102, 761, 'Sagardari Express', 'SAGARDARI EXPRESS (761)', 'down', 'intercity', 'broad', '{monday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (103, 762, 'Sagardari Express', 'SAGARDARI EXPRESS (762)', 'up', 'intercity', 'broad', '{tuesday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (104, 821, 'Shaikat Express', 'SHAIKAT EXPRESS (821)', 'down', 'intercity', 'meter', '{thursday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (105, 824, 'Shaikat Express', 'SHAIKAT EXPRESS (824)', 'up', 'intercity', 'meter', '{friday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (106, 753, 'Silkcity Express', 'SILKCITY EXPRESS (753)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'RAJSHAHI', 'high', NULL, TRUE),
  (107, 754, 'Silkcity Express', 'SILKCITY EXPRESS (754)', 'up', 'intercity', 'broad', '{thursday}', 'RAJSHAHI', 'DHAKA', 'high', NULL, TRUE),
  (108, 747, 'Simanta Express', 'SIMANTA EXPRESS (747)', 'down', 'intercity', 'broad', '{tuesday}', 'DHAKA', 'CHILAHATI', 'high', NULL, TRUE),
  (109, 748, 'Simanta Express', 'SIMANTA EXPRESS (748)', 'up', 'intercity', 'broad', '{wednesday}', 'CHILAHATI', 'DHAKA', 'high', NULL, TRUE),
  (110, 775, 'Sirajganj Express', 'SIRAJGANJ EXPRESS (775)', 'down', 'intercity', 'broad', '{friday}', 'DHAKA', 'SIRAJGANJ', 'high', NULL, TRUE),
  (111, 776, 'Sirajganj Express', 'SIRAJGANJ EXPRESS (776)', 'up', 'intercity', 'broad', '{saturday}', 'SIRAJGANJ', 'DHAKA', 'high', NULL, TRUE),
  (112, 787, 'Sonar Bangla Express', 'SONAR BANGLA EXPRESS (787)', 'down', 'intercity', 'meter', '{tuesday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (113, 788, 'Sonar Bangla Express', 'SONAR BANGLA EXPRESS (788)', 'up', 'intercity', 'meter', '{wednesday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (114, 701, 'Suborno Express', 'SUBORNO EXPRESS (701)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (115, 702, 'Suborno Express', 'SUBORNO EXPRESS (702)', 'up', 'intercity', 'meter', '{friday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (116, 725, 'Sundarban Express', 'SUNDARBAN EXPRESS (725)', 'down', 'intercity', 'broad', '{wednesday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (117, 726, 'Sundarban Express', 'SUNDARBAN EXPRESS (726)', 'up', 'intercity', 'broad', '{thursday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (118, 3, 'Tista Eid Special', 'TISTA EID SPL 3 (03)', 'down', 'special', 'broad', '{}', 'DHAKA', 'RANGPUR', 'medium', 'Eid seasonal only', TRUE),
  (119, 4, 'Tista Eid Special', 'TISTA EID SPL 4 (04)', 'up', 'special', 'broad', '{}', 'RANGPUR', 'DHAKA', 'medium', 'Eid seasonal only', TRUE),
  (120, 707, 'Tista Express', 'TISTA EXPRESS (707)', 'down', 'intercity', 'broad', '{friday}', 'DHAKA', 'LALMONIRHAT', 'high', NULL, TRUE),
  (121, 708, 'Tista Express', 'TISTA EXPRESS (708)', 'up', 'intercity', 'broad', '{saturday}', 'LALMONIRHAT', 'DHAKA', 'high', NULL, TRUE),
  (122, 733, 'Titumir Express', 'TITUMIR EXPRESS (733)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'RAJSHAHI', 'high', NULL, TRUE),
  (123, 734, 'Titumir Express', 'TITUMIR EXPRESS (734)', 'up', 'intercity', 'meter', '{saturday}', 'RAJSHAHI', 'DHAKA', 'high', NULL, TRUE),
  (124, 783, 'Tungipara Express', 'TUNGIPARA EXPRESS (783)', 'down', 'intercity', 'broad', '{thursday}', 'DHAKA', 'KHULNA', 'high', NULL, TRUE),
  (125, 784, 'Tungipara Express', 'TUNGIPARA EXPRESS (784)', 'up', 'intercity', 'broad', '{friday}', 'KHULNA', 'DHAKA', 'high', NULL, TRUE),
  (126, 741, 'Turna', 'TURNA (741)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'CHATTOGRAM', 'high', NULL, TRUE),
  (127, 742, 'Turna', 'TURNA (742)', 'up', 'intercity', 'meter', '{friday}', 'CHATTOGRAM', 'DHAKA', 'high', NULL, TRUE),
  (128, 723, 'Udayan Express', 'UDAYAN EXPRESS (723)', 'down', 'intercity', 'meter', '{saturday}', 'DHAKA', 'SYLHET', 'high', NULL, TRUE),
  (129, 724, 'Udayan Express', 'UDAYAN EXPRESS (724)', 'up', 'intercity', 'meter', '{sunday}', 'SYLHET', 'DHAKA', 'high', NULL, TRUE),
  (130, 739, 'Upaban Express', 'UPABAN EXPRESS (739)', 'down', 'intercity', 'meter', '{tuesday}', 'DHAKA', 'SYLHET', 'high', NULL, TRUE),
  (131, 740, 'Upaban Express', 'UPABAN EXPRESS (740)', 'up', 'intercity', 'meter', '{wednesday}', 'SYLHET', 'DHAKA', 'high', NULL, TRUE),
  (132, 711, 'Upakul Express', 'UPAKUL EXPRESS (711)', 'down', 'intercity', 'meter', '{friday}', 'DHAKA', 'NOAKHALI', 'high', NULL, TRUE),
  (133, 712, 'Upakul Express', 'UPAKUL EXPRESS (712)', 'up', 'intercity', 'meter', '{friday}', 'NOAKHALI', 'DHAKA', 'high', NULL, TRUE);

-- Update pair_number references (self-referential FK — must be second pass)
UPDATE trains SET pair_number = 736 WHERE number = 735;
UPDATE trains SET pair_number = 735 WHERE number = 736;
UPDATE trains SET pair_number = 792 WHERE number = 791;
UPDATE trains SET pair_number = 791 WHERE number = 792;
UPDATE trains SET pair_number = 804 WHERE number = 803;
UPDATE trains SET pair_number = 803 WHERE number = 804;
UPDATE trains SET pair_number = 732 WHERE number = 731;
UPDATE trains SET pair_number = 731 WHERE number = 732;
UPDATE trains SET pair_number = 796 WHERE number = 795;
UPDATE trains SET pair_number = 795 WHERE number = 796;
UPDATE trains SET pair_number = 786 WHERE number = 785;
UPDATE trains SET pair_number = 785 WHERE number = 786;
UPDATE trains SET pair_number = 744 WHERE number = 743;
UPDATE trains SET pair_number = 743 WHERE number = 744;
UPDATE trains SET pair_number = 810 WHERE number = 809;
UPDATE trains SET pair_number = 809 WHERE number = 810;
UPDATE trains SET pair_number = 110 WHERE number = 109;
UPDATE trains SET pair_number = 109 WHERE number = 110;
UPDATE trains SET pair_number = 802 WHERE number = 801;
UPDATE trains SET pair_number = 801 WHERE number = 802;
UPDATE trains SET pair_number = 806 WHERE number = 805;
UPDATE trains SET pair_number = 805 WHERE number = 806;
UPDATE trains SET pair_number = 764 WHERE number = 763;
UPDATE trains SET pair_number = 763 WHERE number = 764;
UPDATE trains SET pair_number = 814 WHERE number = 813;
UPDATE trains SET pair_number = 813 WHERE number = 814;
UPDATE trains SET pair_number = 770 WHERE number = 769;
UPDATE trains SET pair_number = 769 WHERE number = 770;
UPDATE trains SET pair_number = 780 WHERE number = 779;
UPDATE trains SET pair_number = 779 WHERE number = 780;
UPDATE trains SET pair_number = 768 WHERE number = 767;
UPDATE trains SET pair_number = 767 WHERE number = 768;
UPDATE trains SET pair_number = 758 WHERE number = 757;
UPDATE trains SET pair_number = 757 WHERE number = 758;
UPDATE trains SET pair_number = 750 WHERE number = 749;
UPDATE trains SET pair_number = 749 WHERE number = 750;
UPDATE trains SET pair_number = 738 WHERE number = 737;
UPDATE trains SET pair_number = 737 WHERE number = 738;
UPDATE trains SET pair_number = 706 WHERE number = 705;
UPDATE trains SET pair_number = 705 WHERE number = 706;
UPDATE trains SET pair_number = 778 WHERE number = 777;
UPDATE trains SET pair_number = 777 WHERE number = 778;
UPDATE trains SET pair_number = 826 WHERE number = 825;
UPDATE trains SET pair_number = 825 WHERE number = 826;
UPDATE trains SET pair_number = 800 WHERE number = 799;
UPDATE trains SET pair_number = 799 WHERE number = 800;
UPDATE trains SET pair_number = 746 WHERE number = 745;
UPDATE trains SET pair_number = 745 WHERE number = 746;
UPDATE trains SET pair_number = 718 WHERE number = 717;
UPDATE trains SET pair_number = 717 WHERE number = 718;
UPDATE trains SET pair_number = 774 WHERE number = 773;
UPDATE trains SET pair_number = 773 WHERE number = 774;
UPDATE trains SET pair_number = 42 WHERE number = 41;
UPDATE trains SET pair_number = 41 WHERE number = 42;
UPDATE trains SET pair_number = 716 WHERE number = 715;
UPDATE trains SET pair_number = 715 WHERE number = 716;
UPDATE trains SET pair_number = 782 WHERE number = 781;
UPDATE trains SET pair_number = 781 WHERE number = 782;
UPDATE trains SET pair_number = 714 WHERE number = 713;
UPDATE trains SET pair_number = 713 WHERE number = 714;
UPDATE trains SET pair_number = 798 WHERE number = 797;
UPDATE trains SET pair_number = 797 WHERE number = 798;
UPDATE trains SET pair_number = 752 WHERE number = 751;
UPDATE trains SET pair_number = 751 WHERE number = 752;
UPDATE trains SET pair_number = 756 WHERE number = 755;
UPDATE trains SET pair_number = 755 WHERE number = 756;
UPDATE trains SET pair_number = 704 WHERE number = 703;
UPDATE trains SET pair_number = 703 WHERE number = 704;
UPDATE trains SET pair_number = 730 WHERE number = 729;
UPDATE trains SET pair_number = 729 WHERE number = 730;
UPDATE trains SET pair_number = 722 WHERE number = 721;
UPDATE trains SET pair_number = 721 WHERE number = 722;
UPDATE trains SET pair_number = 790 WHERE number = 789;
UPDATE trains SET pair_number = 789 WHERE number = 790;
UPDATE trains SET pair_number = 766 WHERE number = 765;
UPDATE trains SET pair_number = 765 WHERE number = 766;
UPDATE trains SET pair_number = 760 WHERE number = 759;
UPDATE trains SET pair_number = 759 WHERE number = 760;
UPDATE trains SET pair_number = 720 WHERE number = 719;
UPDATE trains SET pair_number = 719 WHERE number = 720;
UPDATE trains SET pair_number = 794 WHERE number = 793;
UPDATE trains SET pair_number = 793 WHERE number = 794;
UPDATE trains SET pair_number = 710 WHERE number = 709;
UPDATE trains SET pair_number = 709 WHERE number = 710;
UPDATE trains SET pair_number = 10 WHERE number = 9;
UPDATE trains SET pair_number = 9 WHERE number = 10;
UPDATE trains SET pair_number = 816 WHERE number = 815;
UPDATE trains SET pair_number = 815 WHERE number = 816;
UPDATE trains SET pair_number = 823 WHERE number = 822;
UPDATE trains SET pair_number = 822 WHERE number = 823;
UPDATE trains SET pair_number = 58 WHERE number = 57;
UPDATE trains SET pair_number = 57 WHERE number = 58;
UPDATE trains SET pair_number = 78 WHERE number = 77;
UPDATE trains SET pair_number = 77 WHERE number = 78;
UPDATE trains SET pair_number = 772 WHERE number = 771;
UPDATE trains SET pair_number = 771 WHERE number = 772;
UPDATE trains SET pair_number = 828 WHERE number = 827;
UPDATE trains SET pair_number = 827 WHERE number = 828;
UPDATE trains SET pair_number = 728 WHERE number = 727;
UPDATE trains SET pair_number = 727 WHERE number = 728;
UPDATE trains SET pair_number = 762 WHERE number = 761;
UPDATE trains SET pair_number = 761 WHERE number = 762;
UPDATE trains SET pair_number = 824 WHERE number = 821;
UPDATE trains SET pair_number = 821 WHERE number = 824;
UPDATE trains SET pair_number = 754 WHERE number = 753;
UPDATE trains SET pair_number = 753 WHERE number = 754;
UPDATE trains SET pair_number = 748 WHERE number = 747;
UPDATE trains SET pair_number = 747 WHERE number = 748;
UPDATE trains SET pair_number = 776 WHERE number = 775;
UPDATE trains SET pair_number = 775 WHERE number = 776;
UPDATE trains SET pair_number = 788 WHERE number = 787;
UPDATE trains SET pair_number = 787 WHERE number = 788;
UPDATE trains SET pair_number = 702 WHERE number = 701;
UPDATE trains SET pair_number = 701 WHERE number = 702;
UPDATE trains SET pair_number = 726 WHERE number = 725;
UPDATE trains SET pair_number = 725 WHERE number = 726;
UPDATE trains SET pair_number = 4 WHERE number = 3;
UPDATE trains SET pair_number = 3 WHERE number = 4;
UPDATE trains SET pair_number = 708 WHERE number = 707;
UPDATE trains SET pair_number = 707 WHERE number = 708;
UPDATE trains SET pair_number = 734 WHERE number = 733;
UPDATE trains SET pair_number = 733 WHERE number = 734;
UPDATE trains SET pair_number = 784 WHERE number = 783;
UPDATE trains SET pair_number = 783 WHERE number = 784;
UPDATE trains SET pair_number = 742 WHERE number = 741;
UPDATE trains SET pair_number = 741 WHERE number = 742;
UPDATE trains SET pair_number = 724 WHERE number = 723;
UPDATE trains SET pair_number = 723 WHERE number = 724;
UPDATE trains SET pair_number = 740 WHERE number = 739;
UPDATE trains SET pair_number = 739 WHERE number = 740;
UPDATE trains SET pair_number = 712 WHERE number = 711;
UPDATE trains SET pair_number = 711 WHERE number = 712;

-- ------------------------------------------------------------
-- TRAIN STOPS (43 rows across 8 trains)
-- ⚠️  PARTIAL DATA — only 8 trains seeded. See DATA_UPDATE_PROCESS.md.
-- ------------------------------------------------------------
INSERT INTO train_stops (train_number, station_code, stop_sequence, arrive_time, depart_time, day_offset, is_origin, is_destination) VALUES
  (787, 'DHKA', 1, NULL, '07:00', 0, TRUE, FALSE),
  (787, 'DABB', 2, '07:20', '07:22', 0, FALSE, FALSE),
  (787, 'CTG', 3, '11:55', NULL, 0, FALSE, TRUE),
  (788, 'CTG', 1, NULL, '15:00', 0, TRUE, FALSE),
  (788, 'DABB', 2, '19:38', '19:40', 0, FALSE, FALSE),
  (788, 'DHKA', 3, '19:55', NULL, 0, FALSE, TRUE),
  (703, 'CTG', 1, NULL, '15:00', 0, TRUE, FALSE),
  (703, 'COM', 2, '17:10', '17:15', 0, FALSE, FALSE),
  (703, 'AKH', 3, '17:55', '18:00', 0, FALSE, FALSE),
  (703, 'BBZ', 4, '18:45', '18:50', 0, FALSE, FALSE),
  (703, 'NSD', 5, '19:20', '19:22', 0, FALSE, FALSE),
  (703, 'DHKA', 6, '21:40', NULL, 0, FALSE, TRUE),
  (704, 'DHKA', 1, NULL, '07:45', 0, TRUE, FALSE),
  (704, 'NSD', 2, '08:45', '08:47', 0, FALSE, FALSE),
  (704, 'BBZ', 3, '09:20', '09:25', 0, FALSE, FALSE),
  (704, 'AKH', 4, '10:10', '10:15', 0, FALSE, FALSE),
  (704, 'COM', 5, '10:55', '11:00', 0, FALSE, FALSE),
  (704, 'CTG', 6, '14:25', NULL, 0, FALSE, TRUE),
  (701, 'DHKA', 1, NULL, '07:00', 0, TRUE, FALSE),
  (701, 'DABB', 2, '07:20', '07:22', 0, FALSE, FALSE),
  (701, 'NSD', 3, '08:20', '08:22', 0, FALSE, FALSE),
  (701, 'COM', 4, '10:00', '10:05', 0, FALSE, FALSE),
  (701, 'CTG', 5, '13:30', NULL, 0, FALSE, TRUE),
  (739, 'DHKA', 1, NULL, '21:40', 0, TRUE, FALSE),
  (739, 'DABB', 2, '22:00', '22:02', 0, FALSE, FALSE),
  (739, 'BBZ', 3, '23:10', '23:15', 0, FALSE, FALSE),
  (739, 'AKH', 4, '00:10', '00:15', 1, FALSE, FALSE),
  (739, 'SRM', 5, '02:15', '02:20', 1, FALSE, FALSE),
  (739, 'SYT', 6, '04:50', NULL, 1, FALSE, TRUE),
  (707, 'DHKA', 1, NULL, '19:00', 0, TRUE, FALSE),
  (707, 'DABB', 2, '19:20', '19:22', 0, FALSE, FALSE),
  (707, 'TNG', 3, '19:45', '19:48', 0, FALSE, FALSE),
  (707, 'IWD', 4, '23:20', '23:30', 0, FALSE, FALSE),
  (707, 'STH', 5, '01:10', '01:20', 1, FALSE, FALSE),
  (707, 'BOG', 6, '02:20', '02:25', 1, FALSE, FALSE),
  (707, 'PBP', 7, '03:55', '04:05', 1, FALSE, FALSE),
  (707, 'LMH', 8, '04:30', NULL, 1, FALSE, TRUE),
  (725, 'DHKA', 1, NULL, '06:20', 0, TRUE, FALSE),
  (725, 'DABB', 2, '06:40', '06:42', 0, FALSE, FALSE),
  (725, 'TNG', 3, '07:05', '07:08', 0, FALSE, FALSE),
  (725, 'IWD', 4, '10:40', '10:50', 0, FALSE, FALSE),
  (725, 'JS', 5, '13:05', '13:10', 0, FALSE, FALSE),
  (725, 'KHU', 6, '14:50', NULL, 0, FALSE, TRUE);

-- ------------------------------------------------------------
-- SAMPLE FARES (13 rows — community sourced, NOT for live pricing)
-- ------------------------------------------------------------
INSERT INTO sample_fares (from_city, to_city, seat_class_code, base_fare, vat_amount, online_charge, source, note) VALUES
  ('DHAKA', 'CHATTOGRAM', 'S_CHAIR', 350, 0, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'CHATTOGRAM', 'SNIGDHA', 672, 101, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'CHATTOGRAM', 'F_BERTH', 960, 0, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'CHATTOGRAM', 'AC_B', 1447, 217, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'CHATTOGRAM', 'AC_S', 1050, 158, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'SYLHET', 'S_CHAIR', 315, 0, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'SYLHET', 'SNIGDHA', 624, 94, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'SYLHET', 'AC_B', 1344, 202, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'RAJSHAHI', 'S_CHAIR', 380, 0, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'RAJSHAHI', 'SNIGDHA', 730, 110, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'KHULNA', 'S_CHAIR', 430, 0, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'KHULNA', 'SNIGDHA', 826, 124, 25, 'community', 'SAMPLE ONLY — fetch live from API'),
  ('DHAKA', 'KHULNA', 'AC_B', 1780, 267, 25, 'community', 'SAMPLE ONLY — fetch live from API');

-- ============================================================
-- Verify seed
-- ============================================================
SELECT 'seat_classes' AS tbl, COUNT(*) FROM seat_classes
UNION ALL SELECT 'stations', COUNT(*) FROM stations
UNION ALL SELECT 'trains', COUNT(*) FROM trains
UNION ALL SELECT 'train_stops', COUNT(*) FROM train_stops
UNION ALL SELECT 'sample_fares', COUNT(*) FROM sample_fares;