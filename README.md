# Stablecog - [stablecog.com](https://stablecog.com)

This is an app made with [SvelteKit](https://kit.svelte.dev) for connecting to [Stable Diffusion](https://github.com/CompVis/stable-diffusion) cogs and creating AI generated images. For more info on cogs, you can check out: [Replicate](https://replicate.com). The app knows how to communicate with this specific cog to generate images: [Stable Diffusion Cog](https://replicate.com/stability-ai/stable-diffusion). However, as long as your cog has the endpoints and the parameters the app uses, it'll work.

---

## Running the app in development mode

First, install the dependencies with:

```bash
npm install
```

Then, you can run the app in development mode with:

```bash
npm run dev
```

---

## Running the app in production mode

First, create a production version of the app:

```bash
npm run build
```

Then, you can start the app in production mode with:

```bash
node ./build
```

If you want to deploy the app, you should edit or remove the `ci.yml` file in `.github/workflows` to suit your setup. There is also a `kubernetes` folder with the config files to deploy on Kubernetes but those are again specific to my setup, so you can edit, remove or ignore those.

---

## Optionals

There is an `.env.example` file in the root directory. You can copy this file and rename it to `.env`. This will allow you to set the following optional environment variables:

- `PUBLIC_DEFAULT_SERVER_URL`: This is the default server url (your cog's url) that the app uses to generate images if provided. You can still change to another server in the app by clicking the settings icon in the top right corner of the home page.
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ADMIN_KEY`
