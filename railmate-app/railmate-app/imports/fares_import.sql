INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'S_CHAIR',
  375
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'CTG';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'SNIGDHA',
  798
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'CTG';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'F_BERTH',
  985
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'CTG';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'AC_B',
  1689
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'CTG';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'AC_S',
  1233
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'CTG';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'S_CHAIR',
  340
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'SYT';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'SNIGDHA',
  743
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'SYT';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'AC_B',
  1571
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'SYT';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'S_CHAIR',
  405
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'RAJ';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'SNIGDHA',
  865
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'RAJ';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'S_CHAIR',
  455
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'KHU';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'SNIGDHA',
  975
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'KHU';

INSERT INTO fares (
  train_id,
  from_station_id,
  to_station_id,
  class,
  price_bdt
)
SELECT
  NULL,
  fs.id,
  ts.id,
  'AC_B',
  2072
FROM stations fs
CROSS JOIN stations ts
WHERE fs.code = 'DHKA'
AND ts.code = 'KHU';
