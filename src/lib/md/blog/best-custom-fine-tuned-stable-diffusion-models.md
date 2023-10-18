---
title: Best Custom (Fine-Tuned) Stable Diffusion Models
description: Fine-tuned Stable Diffusion models let you achieve certain styles of art easier. When they are fine-tuned nicely, they reproduce styles in higher quality.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2022-12-01T13:00:00.000Z
tags: stable-diffusion, fine-tune, models, text-to-image, ai
---

<script>
  import Button from '$components/buttons/Button.svelte'
  import DocImage from '$components/docs/DocImage.svelte'
</script>

Stable Diffusion is an open source AI model to generate images. It is like DALL-E and Midjourney but open source, free for everyone to use, modify, and improve. In this article, I've curated some of my favorite custom Stable Diffusion models that are fine-tuned on different datasets to achieve certain styles easier and reproduce them better.

## [Openjourney](https://huggingface.co/prompthero/openjourney)

Openjourney is a fine-tuned Stable Diffusion model that tries to mimic the style of [Midjourney](https://midjourney.com). It is created by [Prompthero](https://twitter.com/prompthero) and [available on Hugging Face](https://huggingface.co/prompthero/openjourney) for everyone to download and use for free. Openjourney is one of the most popular fine-tuned Stable Diffusion models on Hugging Face with 56K+ downloads last month at the time of writing.

<DocImage src="https://ba.stablecog.com/blog/openjourney.jpg" href="https://huggingface.co/prompthero/openjourney" width="2560" height="3840" alt="Openjourney" />

In my experience, it does a relatively good job of mimicking the style of Midjourney with certain kinds of prompts. However, it tends to give results that are sometimes too similar to each other, a narrowed down "Midjourney style" if you will. In exchange, you can get pretty good results with relatively short prompts.

Openjourney model is available on [Stablecog](https://stablecog.com/generate/?mi=8acfe4c8-751d-4aa6-8c3c-844e3ef478e0&adv=true) and you can use it for free by clicking the link below:

<Button class='mt-4 mb-2' href="https://stablecog.com/generate/?mi=8acfe4c8-751d-4aa6-8c3c-844e3ef478e0&adv=true" target="_blank">
  Try Openjourney
</Button>

Openjourney will be pre-selected for you in the UI, you can enter a prompt and just click "Generate".

## [Arcane Diffusion](https://huggingface.co/nitrosocke/Arcane-Diffusion)

Arcane Diffusion tries to mimic the style of the popular TV series [Arcane](https://www.imdb.com/title/tt11126994/). It is created by [@nitrosocke](https://twitter.com/nitrosocke) and [available on Hugging Face](https://huggingface.co/nitrosocke/Arcane-Diffusion) for everyone to download and use for free. Arcane Diffusion is one of the most popular fine-tuned Stable Diffusion models on Hugging Face with 30K+ downloads last month at the time of writing.

<DocImage src="https://ba.stablecog.com/blog/arcane-diffusion.jpg" href="https://huggingface.co/nitrosocke/Arcane-Diffusion" width="2560" height="4480" alt="Arcane Diffusion" />

In my experience, it does a very good job of mimicking the style of the TV series Arcane. However, since that series has such a unique and well-defined world, using Arcane Diffusion for certain kinds of prompts might not produce good results.

Arcane Diffusion model is available on [Stablecog](https://stablecog.com/generate/?mi=36d9d835-646f-4fc7-b9fe-98654464bf8e&adv=true) and you can use it for free by clicking the link below:

<Button class='mt-4 mb-2' href="https://stablecog.com/generate/?mi=36d9d835-646f-4fc7-b9fe-98654464bf8e&adv=true" target="_blank">
  Try Arcane Diffusion
</Button>

Arcane Diffusion will be pre-selected for you in the UI, you can enter a prompt and just click "Generate".

## [Mo-Di Diffusion](https://huggingface.co/nitrosocke/mo-di-diffusion)

Mo-Di Diffusion tries to mimic the style of Disney's modern animated films. It is created by [@nitrosocke](https://twitter.com/nitrosocke) and [available on Hugging Face](https://huggingface.co/nitrosocke/mo-di-diffusion) for everyone to download and use for free. Mo-Di Diffusion is another very popular fine-tuned Stable Diffusion model with 26K+ downloads last month on Hugging Face at the time of writing.

<DocImage src="https://ba.stablecog.com/blog/mo-di-diffusion.jpg" href="https://huggingface.co/nitrosocke/mo-di-diffusion" width="2560" height="3840" alt="Mo-Di Diffusion" />

In my experience, it does a good job of mimicking the style of the Disney's modern animated films. It seems like the dataset used to fine-tune the model includes a relatively good variety of subjects and it is able to generate a variety of subjects in the style of Disney's modern animated films.

Mo-Di Diffusion model is available on [Stablecog](https://stablecog.com/generate/?mi=790c80e1-65b1-4556-9332-196344389572&adv=true) and you can use it for free by clicking the link below:

<Button class='mt-4 mb-2' href="https://stablecog.com/generate/?mi=790c80e1-65b1-4556-9332-196344389572&adv=true" target="_blank">
  Try Mo-Di Diffusion
</Button>

Mo-Di Diffusion will be pre-selected for you in the UI, you can enter a prompt and just click "Generate".

## [Waifu Diffusion](https://huggingface.co/hakurei/waifu-diffusion)

Waifu Diffusion is an anime style model. It is created by [harubaru](https://github.com/harubaru) and [available on Hugging Face](https://huggingface.co/hakurei/waifu-diffusion) for everyone to download and use for free. Waifu Diffusion is by far the most popular model in this list with 176K+ downloads last month on Hugging Face at the time of writing.

<DocImage src="https://ba.stablecog.com/blog/waifu-diffusion.jpg" href="https://huggingface.co/hakurei/waifu-diffusion" width="2560" height="5760" alt="Waifu Diffusion" />

In my experience, it does a good job within the anime style. However, it has a liking for NSFW content and tends to generate NSFW content even with relatively innocent prompts.

It is available on [Stablecog](https://stablecog.com/generate/?mi=f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9&adv=true) and you can use it for free by clicking the link below:

<Button class='mt-4 mb-2' href="https://stablecog.com/generate/?mi=f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9&adv=true" target="_blank">
  Try Waifu Diffusion
</Button>

Waifu Diffusion will be pre-selected for you in the UI, you can enter a prompt and just click "Generate".

## [Ghibli Diffusion](https://huggingface.co/nitrosocke/Ghibli-Diffusion)

Ghibli Diffusion tries to mimic the style of [Studio Ghibli](https://www.studioghibli.com.au). It is created by [@nitrosocke](https://twitter.com/nitrosocke) and [available on Hugging Face](https://huggingface.co/nitrosocke/Ghibli-Diffusion) for everyone to download and use for free. Ghibli Diffusion is less popular compared to others in this list with 2.8K+ downloads last month on Hugging Face at the time of writing.

<DocImage src="https://ba.stablecog.com/blog/ghibli-diffusion.jpg" href="https://huggingface.co/nitrosocke/Ghibli-Diffusion" width="2560" height="4480" alt="Ghibli Diffusion" />

In my experience, it does a good job of mimicking the style of some of the Studio Ghibli's work. However, it produces artifacts with some prompts and the dataset used to fine tune Stable Diffusion doesn't seem particularly large judging by the results.

Ghibli Diffusion model is available on [Stablecog](https://stablecog.com/generate/?mi=48a7031d-43b6-4a23-9f8c-8020eb6862e4&adv=true) and you can use it for free by clicking the link below:

<Button class='mt-4 mb-2' href="https://stablecog.com/generate/?mi=48a7031d-43b6-4a23-9f8c-8020eb6862e4&adv=true" target="_blank">
  Try Ghibli Diffusion
</Button>

Ghibli Diffusion will be pre-selected for you in the UI, you can enter a prompt and just click "Generate".
