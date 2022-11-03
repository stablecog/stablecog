FROM node:16-alpine

# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all local files into the image.
COPY . .

RUN --mount=type=secret,id=PUBLIC_DEFAULT_SERVER_URL \
  --mount=type=secret,id=PUBLIC_SUPABASE_URL \
  --mount=type=secret,id=PUBLIC_SUPABASE_ANON_KEY \
  --mount=type=secret,id=SUPABASE_PROJECT_ID \
  --mount=type=secret,id=SUPABASE_ADMIN_KEY \
  --mount=type=secret,id=R2_ACCESS_KEY_ID \
  --mount=type=secret,id=R2_SECRET_ACCESS_KEY \
  --mount=type=secret,id=PUBLIC_R2_URL \
  --mount=type=secret,id=CLOUDFLARE_ACCOUNT_ID \
  export PUBLIC_DEFAULT_SERVER_URL=$(cat /run/secrets/PUBLIC_DEFAULT_SERVER_URL) && \
  export PUBLIC_SUPABASE_URL=$(cat /run/secrets/PUBLIC_SUPABASE_URL) && \
  export PUBLIC_SUPABASE_ANON_KEY=$(cat /run/secrets/PUBLIC_SUPABASE_ANON_KEY) && \
  export SUPABASE_ADMIN_KEY=$(cat /run/secrets/SUPABASE_ADMIN_KEY) && \
  export SUPABASE_PROJECT_ID=$(cat /run/secrets/SUPABASE_PROJECT_ID) && \
  export R2_ACCESS_KEY_ID=$(cat /run/secrets/R2_ACCESS_KEY_ID) && \
  export R2_SECRET_ACCESS_KEY=$(cat /run/secrets/R2_SECRET_ACCESS_KEY) && \
  export PUBLIC_R2_URL=$(cat /run/secrets/PUBLIC_R2_URL) && \
  export CLOUDFLARE_ACCOUNT_ID=$(cat /run/secrets/CLOUDFLARE_ACCOUNT_ID) && \
  npm run build

###
# Only copy over the Node pieces needed
# ~> Saves 35MB
###
FROM node:16-alpine

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node","./build"]