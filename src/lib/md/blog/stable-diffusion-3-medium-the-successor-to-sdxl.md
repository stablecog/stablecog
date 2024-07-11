---
title: 'Stable Diffusion 3 Medium: The Successor to SDXL'
description: Stable Diffusion 3 Medium is the latest addition to the Stable Diffusion series of models. It has a much better understanding of your prompts and can incorporate text into images.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2024-07-11T15:00:00.000Z
tags: Stable Diffusion 3, Stable Diffusion, Text to Image, Image to Image, Stable Diffusion, Models, AI
---

<script>
  import Button from '$lib/components/primitives/buttons/Button.svelte';
  import DocImage from '$lib/components/docs/DocImage.svelte';
</script>

The [company](https://stability.ai/) behind [SDXL](https://stability.ai/news/stable-diffusion-sdxl-1-announcement) announced their latest model a month ago: [Stable Diffusion 3 Medium](https://stability.ai/news/stable-diffusion-3-medium). Stability AI describes it as their "most advance text-to-image open model". It comprehends your prompts significantly better and is able to incorporate text into images. Let's take a look at what it offers.

## Text in Images

One of the big shortcomings of SDXL was that it couldn't incorporate text into images. Stable Diffusion 3 Medium can do that. However usually it takes a couple of tries to get the spelling right.

### Text Example 1

Prompt: a cute magical creature in front of a big purple neon sign that says "This is nice!", cinematic, a city in the background.

<DocImage src="https://ba.stablecog.com/blog/sd3-medium-example-this-is-nice-v2.jpeg" width="5120" height="2880" alt='a cute magical creature in front of a big purple neon sign that says "This is nice!", cinematic, a city in the background' />

### Text Example 2

Prompt: balloons shaped as letters to make the word "autumn", a high end home in the background, cinematic, autumn colors, old Leica photo.
<DocImage src="https://ba.stablecog.com/blog/sd3-medium-example-autumn.jpeg" width="5120" height="2880" alt='balloons shaped as letters to make the word "autumn", a high end home in the background, cinematic, autumn colors, old Leica photo' />

## Better Prompt Understanding

Stable Diffusion 3 Medium has a much better understanding of your prompts compared to SDXL. This comes in handy when you are trying to generate very specific images. For example if your images requires a red bottle on the left and a blue bottle on the right, it can do that.

### Example 1

Prompt: ancient magical translucent bottles, left one has a red liquid in it, middle one has a green liquid in it, and the right one has a blue liquid in it, an ancient room in the background, Unreal Engine render.
<DocImage src="https://ba.stablecog.com/blog/sd3-medium-example-3-bottles-v2.jpeg" width="4096" height="4096" alt='3 ancient magical translucent bottles, left one has a red liquid in it, middle one has a green liquid in it, and the right one has a blue liquid in it, an ancient room in the background, Unreal Engine render' />

### Example 2

Prompt: 3 cute medieval cats wearing dresses, left one has a purple dress, the middle one has a yellow dress and the right one has a teal dress, cinematic, dark tones, bokeh.
<DocImage src="https://ba.stablecog.com/blog/sd3-medium-example-cats.jpeg" width="4096" height="4096" alt='3 cute medieval cats wearing dresses, left one has a purple dress, the middle one has a yellow dress and the right one has a teal dress, cinematic, dark tones, bokeh' />

## A Not So Permissive License

Lately, some open-source models have been switching to non-permissive, research only licenses. This means that you can't use those models for commercial purposes without purchasing a license. Stable Diffusion 3 Medium was released with such a license, having heavy restrictions on what you can do with it commercially. Just a couple of days ago [Stability AI modified the license](https://stability.ai/news/license-update) and made it significantly more permissive.

Under the new license, [Stability AI](https://stability.ai) says that you don't need to pay them anything for commercial usage as long as your annual revenue [doesn't exceed 1 million USD](https://stability.ai/news/license-update).

<DocImage href="https://stability.ai/news/license-update" src="https://ba.stablecog.com/blog/stable-diffusion-3-license-update-v3.png" width="1516  " height="1134" alt="Stable Diffusion 3 License Update" />

## Conclusion

Considering it can understand your prompt better than our default model, it can do text in images, it is relatively fast, and its not so permissive license doesn't affect Stablecog, we are making it the default model on [Stablecog](https://stablecog.com/) going forward.

## Give It A Try

You can try Stable Diffusion 3 on [Stablecog](https://stablecog.com/) right now! Just click the button below and see what it can do.
<Button class='mt-4' href="https://stablecog.com/generate?mi=986d447d-c38b-4218-a2c8-6e0b691f47ec" target="_blank">
Try Stable Diffusion 3
</Button>
