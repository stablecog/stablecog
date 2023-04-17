# [Synthica](https://Synthica,ai) AI image generator

This is an app for creating AI generated images using [Stable Diffusion](https://github.com/CompVis/stable-diffusion) cogs. It's made with [SvelteKit](https://kit.svelte.dev), uses [Supabase](https://supabase.com) for recording of metadata and for managing the default cog cluster. For more info on "cogs", you can check out: [Replicate](https://replicate.com). The app is hosted at [Synthica.ai (https://Synthica.ai).

The app knows how to communicate with this cog to generate images: [Stable Diffusion Cog](https://github.com/Synthica/stable-diffusion-cog). It is available on Docker Hub at: [yekta/sc](https://hub.docker.com/r/yekta/sc). However, as long as your server has the endpoints and the parameters the app uses, it'll work.


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
