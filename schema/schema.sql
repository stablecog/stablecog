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

CREATE TABLE "generation_process" (
    "ended" BOOLEAN NOT NULL,
    "succeeded" BOOLEAN NOT NULL,
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