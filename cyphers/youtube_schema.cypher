//Youtube

CREATE CONSTRAINT video_id_uniq IF NOT EXISTS
FOR (v:Video)
REQUIRE v.id IS UNIQUE;

CREATE CONSTRAINT category_Category_uniq IF NOT EXISTS
FOR (n:Category)
REQUIRE n.category IS UNIQUE;

CREATE CONSTRAINT uploader_Uploader_uniq IF NOT EXISTS
FOR (n:Uploader)
REQUIRE n.uploader IS UNIQUE;

:auto LOAD CSV WITH HEADERS FROM 'file:///videos.csv' AS row
WITH row
WHERE NOT row.ID IS NULL
CALL {
  WITH row
  MERGE (v:Video {id: row.ID})
  SET v.age = toInteger(trim(row.age)),
      v.length = toInteger(trim(row.length)),
      v.views = toInteger(trim(row.views)),
      v.rate = toFloat(trim(row.rate)),
      v.ratings = toInteger(trim(row.ratings)),
      v.comments = toInteger(trim(row.comments))
} IN TRANSACTIONS OF 10000 ROWS;

:auto LOAD CSV WITH HEADERS FROM 'file:///related.csv' AS row
WITH row
CALL {
  WITH row
  MATCH (source:Video {id: row.START_ID})
  MATCH (target:Video {id: row.END_ID})
  MERGE (source)-[:RELATED_TO]->(target)
} IN TRANSACTIONS OF 10000 ROWS;

:auto LOAD CSV WITH HEADERS FROM 'file:///videos.csv' AS row
WITH row
CALL {
  WITH row
  MERGE (c:Category {category: row.category})
  WITH row, c
  MATCH (v:Video {id: row.ID})
  MERGE (v)-[:VIDEO_TYPE]->(c)
} IN TRANSACTIONS OF 10000 ROWS;

:auto LOAD CSV WITH HEADERS FROM 'file:///videos.csv' AS row
WITH row
CALL {
  WITH row
  MERGE (u:Uploader {uploader: row.uploader})
  WITH row, u
  MATCH (v:Video {id: row.ID})
  MERGE (v)-[:UPLOADED_BY]->(u)
} IN TRANSACTIONS OF 10000 ROWS;