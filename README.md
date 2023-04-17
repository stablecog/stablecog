# [Synthica](https://Synthica,ai) - Simple, free & open source AI image generator

This is an app for creating AI generated images using [Stable Diffusion](https://github.com/CompVis/stable-diffusion) cogs. It's made with [SvelteKit](https://kit.svelte.dev), uses [Supabase](https://supabase.com) for recording of metadata and for managing the default cog cluster. For more info on "cogs", you can check out: [Replicate](https://replicate.com). The app is hosted at [Synthica.ai (https://Synthica.ai).

he app knows how to communicate with this cog to generate images: [Stable Diffusion Cog](https://github.com/Synthica/stable-diffusion-cog). It is available on Docker Hub at: [yekta/sc](https://hub.docker.com/r/yekta/sc). However, as long as your server has the endpoints and the parameters the app uses, it'll work.

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

---

## Special Thanks

[**Mahdi**](https://twitter.com/MahdiMC) has been contributing by providing two NVIDIA A40s which are being used for the default cog cluster. Thanks to his contribution, thousands of people generated 150K+ images (so far) for free, without seeing any ads or dealing with sign ups.

Following people have contributed by translating the app to their language. Thanks to their contributions, billions of people can use the app in their native language:

- [**Arkhath**](https://twitter.com/Arkhath): French
- [**Behoney**](https://github.com/behoney): Korean
- [**Chibi**](https://twitter.com/CryptoChibs): Spanish
- [**Jatt**](https://twitter.com/BananoJatt): Hindi
- [**Just_Dmitry**](https://github.com/justdmitry): Russian
- **Mongoose#3074**: Chinese Traditional
- [**Nnq2603**](mailto:5vil@live.com): Vietnamese
- [**Sebrock**](https://twitter.com/sebrock): German
