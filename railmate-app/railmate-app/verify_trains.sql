-- Quick verification: Are all trains populated with routes?
SELECT
  COUNT(*) FILTER (WHERE origin_id IS NOT NULL AND destination_id IS NOT NULL) as trains_with_routes,
  COUNT(*) FILTER (WHERE origin_id IS NULL OR destination_id IS NULL) as trains_without_routes,
  COUNT(*) as total_trains
FROM trains;

-- Verify Aghnibina Express #735 (Dhaka → Sylhet)
SELECT 
  t.number,
  t.name_en,
  s1.name_en as origin_station,
  s2.name_en as destination_station,
  t.days_of_week,
  t.is_active
FROM trains t
LEFT JOIN stations s1 ON t.origin_id = s1.id
LEFT JOIN stations s2 ON t.destination_id = s2.id
WHERE t.number = '735';
