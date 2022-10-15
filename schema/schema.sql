CREATE extension IF NOT EXISTS moddatetime schema extensions;

CREATE TYPE generation_status_enum AS ENUM ('started', 'succeeded', 'failed', 'rejected');

CREATE TABLE "generation" (
    "prompt" TEXT,
    "negative_prompt" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "seed" BIGINT NOT NULL,
    "num_inference_steps" INTEGER NOT NULL,
    "guidance_scale" DOUBLE PRECISION NOT NULL,
    "server_url" TEXT NOT NULL,
    "duration_ms": INTEGER,
    "status" generation_status_enum NOT NULL,
    "country_code" TEXT,
    "device_type" TEXT,
    "device_os" TEXT,
    "device_browser" TEXT,
    "user_agent" TEXT,
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON generation FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    generation ENABLE ROW LEVEL SECURITY;

CREATE VIEW generation_public AS
SELECT
    id,
    duration_ms,
    status,
    country_code,
    created_at,
    updated_at
FROM
    generation;

CREATE
OR REPLACE FUNCTION generation_count() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    generation_public
WHERE
    status = 'succeeded'
    OR status IS NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_with_non_null_duration_ms_average() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) / COUNT('*') AS generation_with_non_null_duration_ms_average
FROM
    generation_public
WHERE
    duration_ms IS NOT NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_with_non_null_duration_ms_total() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) generation_with_non_null_duration_ms_total
FROM
    generation_public
WHERE
    duration_ms IS NOT NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_count_with_null_duration_ms() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    generation_public
WHERE
    duration_ms IS NULL
    AND status != 'started' $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_duration_ms_total_estimate() RETURNS BIGINT AS $ $
SELECT
    generation_with_non_null_duration_ms_total() + generation_count_with_null_duration_ms() * generation_with_non_null_duration_ms_average() $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_duration_ms_total_estimate_with_constant() RETURNS BIGINT AS $ $
SELECT
    generation_with_non_null_duration_ms_total() + generation_count_with_null_duration_ms() * 12000 $ $ language SQL;