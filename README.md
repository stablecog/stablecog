# [Stablecog](https://stablecog.com) - Create amazing art in seconds with AI.

This is an app for creating AI generated images using [Stable Diffusion](https://github.com/CompVis/stable-diffusion) and [Kandinsky](https://github.com/ai-forever/Kandinsky-2). It's made with [SvelteKit](https://kit.svelte.dev). It uses [Supabase](https://supabase.com) for user data and auth. The app is hosted at [stablecog.com](https://stablecog.com). The app needs [our worker](https://github.com/stablecog.com/sc-worker) and [GO server](https://github.com/stablecog/sc-go) to be fully functional.

| ![Stablecog Home (Dark Mode)](https://ba.stablecog.com/mockups/home-dark-window-2560.webp) |
| :----------------------------------------------------------------------------------------: |
|                 <b>[Home (Dark Mode)](https://stablecog.com/generate)</b>                  |

| ![Stablecog Home (Light Mode)](https://ba.stablecog.com/mockups/home-light-window-2560.webp) |
| :------------------------------------------------------------------------------------------: |
|                  <b>[Home (Light Mode)](https://stablecog.com/generate)</b>                  |

| ![Stablecog Gallery](https://ba.stablecog.com/mockups/gallery-dark-window-2560.webp) |
| :----------------------------------------------------------------------------------: |
|                   <b>[Gallery](https://stablecog.com/gallery)</b>                    |

| ![Stablecog Live](https://ba.stablecog.com/mockups/live-dark-window-2560.webp) |
| :----------------------------------------------------------------------------: |
|                   <b>[Live](https://stablecog.com/live)</b>                    |

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

---

## Important Note

Although everything we do is fully open-source, this README doesn't document what you need to get the entire system running. If we have more time, we'll try to document all of the pieces you need to get the system up.

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
