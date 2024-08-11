---
title: What is FLUX.1?
description: FLUX.1 is an open-source 12 billion parameter rectified flow transformer model with state of the art prompt adherence. It can incorporate text into images, and has a very nice aesthetic.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2024-07-10T15:00:00.000Z
---

<script>
  import Button from '$components/primitives/buttons/Button.svelte'
  import DocImage from '$components/docs/DocImage.svelte'
</script>

# FLUX.1

FLUX.1 is a model created by [Black Forest Labs](https://blackforestlabs.ai/our-team/), a company with a team that contributed to the creation of the original [Stable Diffusion](https://github.com/CompVis/stable-diffusion). It is a [12 billion parameter](https://huggingface.co/black-forest-labs/FLUX.1-schnell) rectified flow transformer model. It has exceptional prompt adherence, can incorporate text into images, and has a very nice aesthetic. It has 3 versions. The smallest and fastest one, [FLUX.1[schnell]](https://huggingface.co/black-forest-labs/FLUX.1-schnell), is open-source under the Apache 2.0 license.

FLUX.1 is general purpose model that is good at variety of styles, realistic or artistic. [FLUX.1[schnell]](https://huggingface.co/black-forest-labs/FLUX.1-schnell) version is quite fast on high end consumer GPUs but requires 20GB+ of VRAM to run.

## FLUX.1 Examples

Here are some images created with FLUX.1 on Stablecog.

### Example 1

<DocImage caption src="https://ba.stablecog.com/blog/ranger-woman-with-scales.jpeg" width="5120" height="2880" alt='Photoreal gorgeous thrity year old green-blue triton ranger woman with green-blue scaled green-blue skin floating in the deep ocean realm by lee jeffries, otherworldly creature, in the style of fantasy movies, photorealistic, bokeh masterpiece smooth shading, ultra detailed, high resolution, cinematic, unreal 6, subtle shadows, octane render, 8k, cinema 4d, HDR, dust effect, vivid colors.' />

### Example 2

<DocImage caption src="https://ba.stablecog.com/blog/crochet-puppy.jpeg" width="5120" height="2880" alt="A visually enchanting 4K photograph featuring a lovable, Pixar-inspired miniature pinscher puppy, expertly crafted in a whimsical and vibrant cartoon style. The puppy, adorned with soft fur and expressive features, is masterfully rendered in a lifelike 3D amigurumi crochet design, which captivates viewers with its irresistible charm. The background is filled with warm, inviting colors and a 3D render, creating a cinematic atmosphere that further accentuates the puppy's enchanting appeal." />

### Example 3

<DocImage caption src="https://ba.stablecog.com/blog/stablecog-fur-v2.jpeg" width="5120" height="2880" alt='the text "Stablecog" made out of purple fur, orange furs in the background, orange background, cinematitc lighting' />

### Example 4

<DocImage caption src="https://ba.stablecog.com/blog/woman-made-out-of-spikes.jpeg" width="5120" height="2880" alt="A female humanoid sculpture, intricate and detailed, crafted from thousands of tiny steel spikes, each element expertly fashioned with razor-sharp precision, standing confidently. The figure's delicate features are beautifully replicated, showcasing the elegant curves of its form and the precise angles of its face, creating a dazzling interplay of light and shadow that draws the eye. Background is completely covered by steel spikes" />

### Example 5

<DocImage caption src="https://ba.stablecog.com/blog/cute-orange-dragon.jpeg" width="5120" height="2880" alt='a cute magical furry orange dinosaur next to a bronze sign with gold lettering that says "FLUX.1", jungle background, high quality render, golden hour' />

## Try FLUX.1

You can try FLUX.1 on Stablecog for free. Just click the button below.

<Button class="mt-4" href="https://stablecog.com/generate/?mi=0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b" target="_blank">
Try FLUX.1
</Button>

## FLUX.1 on Stablecog Gallery

You can also see more examples of images created with FLUX.1 in our gallery by clicking the button below.

<Button class="mt-4" href="https://stablecog.com/gallery?mi=0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b" target="_blank">
  Explore on Gallery
</Button>
