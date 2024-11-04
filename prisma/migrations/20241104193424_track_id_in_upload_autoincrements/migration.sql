-- AlterTable
CREATE SEQUENCE upload_trackid_seq;
ALTER TABLE "Upload" ALTER COLUMN "trackId" SET DEFAULT nextval('upload_trackid_seq');
ALTER SEQUENCE upload_trackid_seq OWNED BY "Upload"."trackId";
