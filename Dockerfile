FROM node:16-alpine

# install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Copy all local files into the image.
COPY . .

RUN --mount=type=secret,id=PUBLIC_SUPABASE_URL \
  cat /run/secrets/PUBLIC_SUPABASE_URL \
  --mount=type=secret,id=PUBLIC_SUPABASE_ANON_KEY \
  cat /run/secrets/PUBLIC_SUPABASE_ANON_KEY \
  --mount=type=secret,id=SUPABASE_ADMIN_KEY \
  cat /run/secrets/SUPABASE_ADMIN_KEY \
  --mount=type=secret,id=PUBLIC_DEFAULT_SERVER_URL \
  cat /run/secrets/PUBLIC_DEFAULT_SERVER_URL \
  && npm run build

###
# Only copy over the Node pieces we need
# ~> Saves 35MB
###
FROM node:16-alpine

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]