# Stablecog - [stablecog.com](https://stablecog.com)

This is a free and easy to use app for creating AI generated images using [Stable Diffusion](https://github.com/CompVis/stable-diffusion) cogs. It's made with [SvelteKit](https://kit.svelte.dev). For more info on cogs, you can check out: [Replicate](https://replicate.com).

| ![Stablecog (Advanced mode)](https://stablecog.com/images/homepage-advanced.png) |
| :------------------------------------------------------------------------------: |
|                         <b>Stablecog (Advanced Mode)</b>                         |

| ![Stablecog (Default mode)](https://stablecog.com/images/homepage.png) |
| :--------------------------------------------------------------------: |
|                    <b>Stablecog (Default Mode)</b>                     |

The app knows how to communicate with this cog to generate images: [Stable Diffusion Cog](https://github.com/yekta/stable-diffusion-cog). However, as long as your server has the endpoints and the parameters the app uses, it'll work.

For example, the following cogs would also work with the app:

- [stability.ai: Stable Diffusion Cog](https://replicate.com/stability-ai/stable-diffusion)
- [cjwbw: Waifu Diffusion Cog](https://replicate.com/cjwbw/waifu-diffusion)

For the app to work, the cog needs to have the following input properties on the `/predictions` endpoint:

- `prompt`, `width`, `height`, `guidance_scale`, `num_inference_steps`, `seed`.

Optionals:

- `negative_prompt`

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

There is a `.env.example` file in the root directory. You can copy this file and rename it to `.env`. This will allow you to set the following optional environment variables:

- `PUBLIC_DEFAULT_SERVER_URL`: This is the default server url (your cog's url) that the app uses to generate images if provided. You can still change to another server in the app by clicking the settings icon in the top right corner of the home page.
- `PUBLIC_SUPABASE_URL`: In case you want to record generation metadata, you can use a [Supabase](https://supabase.com) instance. This environment variable is for the url of your Supabase instance.
- `PUBLIC_SUPABASE_ADMIN_KEY`. In case you want to record generation metadata, you can use a [Supabase](https://supabase.com) instance. This environment variable is for the admin key of your Supabase instance.

There is a Plausible Analytics script on `src/app.html`. You can remove it or you can change the `data-domain` and `src` attributes to point to your domain and your Plausible instance.
