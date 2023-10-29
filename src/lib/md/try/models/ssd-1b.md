---
title: Try SSD-1B for Free
description: SSD-1B is an open-source diffusion model that has a base resolution of 1024x1024 pixels. It's a distilled version of Stable Diffusion XL (SDXL).
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-04-28T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/try/previews/sdxl.jpg
---

<script>
  import Button from '$components/buttons/Button.svelte'
  import DocImage from '$components/docs/DocImage.svelte'
</script>

# Try SSD-1B for Free

[SSD-1B](https://huggingface.co/segmind/SSD-1B) is an open-source diffusion model, a distilled version of Stable Diffusion XL ([SDXL](https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0)) with about 50% of the size. It is created by [Segmind](https://www.segmind.com). It has a base resolution of 1024x1024 pixels. It offers similar quality to SDXL while offering a 60% speedup.

According to its creators, it uses a knowledge distillation strategy. It uses the teachings of several expert models including SDXL, ZavyChromaXL, and JuggernautXL. It combines their strengths to produce high quality results at a much better speed than Stable Diffusion XL (SDXL).

<Button class="mt-4" href="https://stablecog.com/generate/?mi=4e54440f-ee17-4712-b4b6-0671b94d685d&adv=true" target="_blank">
Try SSD-1B
</Button>

## SSD-1B Examples

Here are some images created with SSD-1B on Stablecog.

<DocImage src="https://ba.stablecog.com/guide/models/ssd-1b.jpg" alt="SSD-1B Examples" width="2560" height="4320"/>

## SSD-1B on Stablecog Gallery

You can also see more examples of images created with SSD-1B in our gallery by clicking the button below.

<Button class="mt-4" href="https://stablecog.com/gallery?mi=4e54440f-ee17-4712-b4b6-0671b94d685d" target="_blank">
  Explore on Gallery
</Button>
