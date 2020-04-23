CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

ALTER TABLE "SiteInfo" ADD COLUMN location geometry(PointZ,4326);
