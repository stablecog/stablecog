# [Stablecog](https://stablecog.com) - Simple, free & open source AI image generator

This is an app for creating AI generated images using [Stable Diffusion](https://github.com/CompVis/stable-diffusion) cogs. It's made with [SvelteKit](https://kit.svelte.dev), uses [Supabase](https://supabase.com) for recording of metadata and for managing the default cog cluster. For more info on "cogs", you can check out: [Replicate](https://replicate.com). The app is hosted at [stablecog.com](https://stablecog.com).

| ![Stablecog Home (Default + Dark Mode)](https://stablecog.com/images/mockups/home-default.png) |
| :--------------------------------------------------------------------------------------------: |
|                               <b>Home (Default + Dark Mode)</b>                                |

| ![Stablecog Home (Advanced + Light Mode)](https://stablecog.com/images/mockups/home-advanced-light.png) |
| :-----------------------------------------------------------------------------------------------------: |
|                                   <b>Home (Advanced + Light Mode)</b>                                   |

| ![Stablecog Gallery](https://stablecog.com/images/mockups/gallery.png) |
| :--------------------------------------------------------------------: |
|                             <b>Gallery</b>                             |

| ![Stablecog Live](https://stablecog.com/images/mockups/live.png) |
| :--------------------------------------------------------------: |
|                           <b>Live</b>                            |

The app knows how to communicate with this cog to generate images: [Stable Diffusion Cog](https://github.com/yekta/sg). It is available on Docker Hub at: [yekta/sg](https://hub.docker.com/r/yekta/sg). However, as long as your server has the endpoints and the parameters the app uses, it'll work.

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

In case you want to record generation metadata, you can use a [Supabase](https://supabase.com) instance. You can set the following environment variables to enable it:

- `PUBLIC_SUPABASE_URL`: The url of your Supabase instance.
- `PUBLIC_SUPABASE_ANON_KEY`: The anon key of your Supabase instance.
- `PUBLIC_SUPABASE_ADMIN_KEY`. The admin key of your Supabase instance.

There is a Plausible Analytics script on `src/app.html`. You can remove it or you can change the `data-domain` and `src` attributes to point to your domain and your Plausible instance.
