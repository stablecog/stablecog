CREATE extension IF NOT EXISTS moddatetime schema extensions;

CREATE TABLE "generation" (
    "prompt" TEXT NOT NULL,
    "negative_prompt" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "seed" BIGINT NOT NULL,
    "num_inference_steps" INTEGER NOT NULL,
    "guidance_scale" DOUBLE PRECISION NOT NULL,
    "server_url" TEXT NOT NULL,
    "duration_ms": INTEGER,
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

CREATE TYPE generation_process_status_enum AS ENUM ('started', 'succeeded', 'failed', 'rejected');

CREATE TABLE "generation_process" (
    "status" generation_process_status_enum NOT NULL,
    "country_code" TEXT,
    "generation_id" UUID REFERENCES generation(id),
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    "updated_at" TIMESTAMPTZ DEFAULT TIMEZONE('utc' :: TEXT, NOW()) NOT NULL,
    PRIMARY KEY(id)
);

CREATE trigger handle_updated_at before
UPDATE
    ON generation_process FOR each ROW EXECUTE PROCEDURE moddatetime (updated_at);

ALTER TABLE
    generation_process ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read generation processes" ON public.generation_process FOR
SELECT
    USING (TRUE);

CREATE VIEW generation_public AS
SELECT
    id,
    duration_ms
FROM
    generation;

CREATE
OR REPLACE FUNCTION generation_count() RETURNS BIGINT AS $ $
SELECT
    COUNT(*)
FROM
    generation_public $ $ language SQL;

CREATE
OR REPLACE FUNCTION non_null_generation_duration_ms_average() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) / COUNT('*') AS non_null_generation_duration_ms_average
FROM
    generation_public
WHERE
    duration_ms IS NOT NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION non_null_generation_duration_ms_total() RETURNS BIGINT AS $ $
SELECT
    SUM (duration_ms) non_null_generation_duration_ms_total
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
    duration_ms IS NULL $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_duration_ms_total_estimate() RETURNS BIGINT AS $ $
SELECT
    non_null_generation_duration_ms_total() + generation_count_with_null_duration_ms() * non_null_generation_duration_ms_average() $ $ language SQL;

CREATE
OR REPLACE FUNCTION generation_duration_ms_total_estimate_with_constant() RETURNS BIGINT AS $ $
SELECT
    non_null_generation_duration_ms_total() + generation_count_with_null_duration_ms() * 10000 $ $ language SQL;