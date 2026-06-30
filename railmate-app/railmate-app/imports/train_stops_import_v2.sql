INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '07:00',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '787'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '07:20',
  '07:22',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '787'
AND s.code = 'DABB';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '11:55',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '787'
AND s.code = 'CTG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '15:00',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '788'
AND s.code = 'CTG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '19:38',
  '19:40',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '788'
AND s.code = 'DABB';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '19:55',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '788'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '15:00',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '703'
AND s.code = 'CTG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '17:10',
  '17:15',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '703'
AND s.code = 'COM';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '17:55',
  '18:00',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '703'
AND s.code = 'AKH';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  4,
  '18:45',
  '18:50',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '703'
AND s.code = 'BBZ';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  5,
  '19:20',
  '19:22',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '703'
AND s.code = 'NSD';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  6,
  '21:40',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '703'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '07:45',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '704'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '08:45',
  '08:47',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '704'
AND s.code = 'NSD';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '09:20',
  '09:25',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '704'
AND s.code = 'BBZ';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  4,
  '10:10',
  '10:15',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '704'
AND s.code = 'AKH';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  5,
  '10:55',
  '11:00',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '704'
AND s.code = 'COM';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  6,
  '14:25',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '704'
AND s.code = 'CTG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '07:00',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '701'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '07:20',
  '07:22',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '701'
AND s.code = 'DABB';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '08:20',
  '08:22',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '701'
AND s.code = 'NSD';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  4,
  '10:00',
  '10:05',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '701'
AND s.code = 'COM';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  5,
  '13:30',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '701'
AND s.code = 'CTG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '21:40',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '739'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '22:00',
  '22:02',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '739'
AND s.code = 'DABB';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '23:10',
  '23:15',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '739'
AND s.code = 'BBZ';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  4,
  '00:10',
  '00:15',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '739'
AND s.code = 'AKH';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  5,
  '02:15',
  '02:20',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '739'
AND s.code = 'SRM';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  6,
  '04:50',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '739'
AND s.code = 'SYT';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '19:00',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '19:20',
  '19:22',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'DABB';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '19:45',
  '19:48',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'TNG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  4,
  '23:20',
  '23:30',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'IWD';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  5,
  '01:10',
  '01:20',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'STH';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  6,
  '02:20',
  '02:25',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'BOG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  7,
  '03:55',
  '04:05',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'PBP';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  8,
  '04:30',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '707'
AND s.code = 'LMH';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  1,
  NULL,
  '06:20',
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '725'
AND s.code = 'DHKA';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  2,
  '06:40',
  '06:42',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '725'
AND s.code = 'DABB';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  3,
  '07:05',
  '07:08',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '725'
AND s.code = 'TNG';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  4,
  '10:40',
  '10:50',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '725'
AND s.code = 'IWD';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  5,
  '13:05',
  '13:10',
  0,
  false
FROM trains t
CROSS JOIN stations s
WHERE t.number = '725'
AND s.code = 'JS';

INSERT INTO train_stops (
  train_id,
  station_id,
  sequence,
  arrival_time,
  departure_time,
  halt_minutes,
  is_major_stop
)
SELECT
  t.id,
  s.id,
  6,
  '14:50',
  NULL,
  0,
  true
FROM trains t
CROSS JOIN stations s
WHERE t.number = '725'
AND s.code = 'KHU';
