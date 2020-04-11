CREATE EXTENSION pg_trgm;

-- Create indices
-- CREATE INDEX tracks_name_gin_idx ON tracks
-- USING GIN ((name) gin_trgm_ops);

-- Track this one:
CREATE FUNCTION search_sites(search text)
    returns setof "SiteInfo" AS $$
SELECT *
FROM "SiteInfo"
WHERE  entity_id  IN (
    Select pk
    FROM "Entity"
    WHERE search <% experience OR search <% notes
)
$$ language sql stable;

-- Drop function if necessary (Track change!)
DROP FUNCTION IF EXISTS search_sites(text);
