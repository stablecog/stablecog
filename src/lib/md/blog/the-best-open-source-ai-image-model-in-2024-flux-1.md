---
title: 'The Best Open Source AI Image Model in 2024: FLUX.1'
description: FLUX.1 has state of the art prompt adherence, can incorporate text into images, and has a very nice aesthetic. It has 3 versions. The smallest and fastest one, FLUX.1[schnell], is open-source.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2024-08-10T15:00:00.000Z
tags: FLUX.1, FLUX, Text to Image, Image to Image, Models, AI
---

<script>
  import Button from '$lib/components/primitives/buttons/Button.svelte';
  import DocImage from '$lib/components/docs/DocImage.svelte';
</script>

[Black Forest Labs](https://blackforestlabs.ai/our-team/), a company with a team that contributed to the creation of the original [Stable Diffusion](https://github.com/CompVis/stable-diffusion) have released their new model called [FLUX.1](https://blackforestlabs.ai/announcing-black-forest-labs/). It is a [12 billion parameter](https://huggingface.co/black-forest-labs/FLUX.1-schnell) rectified flow transformer. Based on discussions on Reddit and HuggingFace, it seems like the community is very excited about this new model. We are as well, in fact, we think it is the best open-source AI image model currently available. Let's take a look at what it offers.

## 3 Model Variants

The model has 3 options with different licenses:

1. **FLUX.1[pro]**: The biggest model with the best performance. It's closed source and available via an API: [FLUX.1[pro] API](https://docs.bfl.ml/).
2. **FLUX.1[dev]**: A smaller model with a similar performance. It's open-weight and available for research only purposes. You can download it here: [FLUX.1[dev]](https://huggingface.co/black-forest-labs/FLUX.1-dev).
3. **FLUX.1[schnell]**: The smallest and fastest model, surprisingly capable. It's open-source (Apache 2.0) and available for commercial purposes. You can download it here: [FLUX.1[schnell]](https://huggingface.co/black-forest-labs/FLUX.1-schnell).

Our blog post will focus on FLUX.1[schnell] as it is open-source and available for commercial purposes. That being said, the other two models will perform slightly better.

## Text in Images

FLUX.1 can incorporate text into images, and it does it very well. In our tests, compared to Stable Diffusion 3 Medium, it was able to generate images with text more accurately and with fewer tries. Here are a couple of examples:

### Text Example 1

<DocImage caption="top" src="https://ba.stablecog.com/blog/stablecog-fur-v2.jpeg" width="5120" height="2880" alt='the text "Stablecog" made out of purple fur, orange furs in the background, orange background, cinematitc lighting' />

### Text Example 2

<DocImage caption="top" src="https://ba.stablecog.com/blog/stablecog-latte-art.jpeg" width="5120" height="2880" alt={`Latte art in a rich, creamy coffee, with "Stablecog" beautifully inscribed in intricate white foam. The scene is cinematic, featuring soft, dramatic lighting that highlights the texture of the foam and the depth of the coffee's color, with subtle bokeh in the background to enhance the luxurious atmosphere.`} />

## Better Prompt Adherence

FLUX.1 has an exceptional understanding of your prompts because it incorporates significantly bigger text encoders. It can also accept longer prompts. This comes in handy when you are trying to describe complicated scenes or trying to go for a very specific style.

### Adherence Example 1

<DocImage caption="top" src="https://ba.stablecog.com/blog/three-turtle-friends.jpeg" width="5120" height="2880" alt='Three turtle friends hanging out in a jungle. The left one wears eye glasses with a yellow frame and red glass, middle one wears a red hat and the right one wears a purple hat. Cinematic scene, beautiful lighting, 3D high quality render' />

### Adherence Example 2

<DocImage caption="top" src="https://ba.stablecog.com/blog/three-miniature-houses.jpeg" width="5120" height="2880" alt='A magical miniature town with only 3 houses and lots of yellow trees. One house is purple, one house is orange and one house is teal' />

## The Aesthetic

Some models adhere to your prompt well but the results are not very aesthetically pleasing. FLUX.1 is definitely not one of them as far as we are concerned. We like its general aesthetic a lot. It can do realistic images or artistic ones. It has a good understanding of color and light. Here are a couple of examples:

### Example 1

<DocImage caption="top" src="https://ba.stablecog.com/blog/ranger-woman-with-scales.jpeg" width="5120" height="2880" alt='Photoreal gorgeous thrity year old green-blue triton ranger woman with green-blue scaled green-blue skin floating in the deep ocean realm by lee jeffries, otherworldly creature, in the style of fantasy movies, photorealistic, bokeh masterpiece smooth shading, ultra detailed, high resolution, cinematic, unreal 6, subtle shadows, octane render, 8k, cinema 4d, HDR, dust effect, vivid colors.' />

### Example 2

<DocImage caption="top" src="https://ba.stablecog.com/blog/crochet-puppy.jpeg" width="5120" height="2880" alt="A visually enchanting 4K photograph featuring a lovable, Pixar-inspired miniature pinscher puppy, expertly crafted in a whimsical and vibrant cartoon style. The puppy, adorned with soft fur and expressive features, is masterfully rendered in a lifelike 3D amigurumi crochet design, which captivates viewers with its irresistible charm. The background is filled with warm, inviting colors and a 3D render, creating a cinematic atmosphere that further accentuates the puppy's enchanting appeal." />

### Example 3

<DocImage caption="top" src="https://ba.stablecog.com/blog/woman-made-out-of-spikes.jpeg" width="5120" height="2880" alt="A female humanoid sculpture, intricate and detailed, crafted from thousands of tiny steel spikes, each element expertly fashioned with razor-sharp precision, standing confidently. The figure's delicate features are beautifully replicated, showcasing the elegant curves of its form and the precise angles of its face, creating a dazzling interplay of light and shadow that draws the eye. Background is completely covered by steel spikes" />

## The VRAM Problem

Because of the aforementioned bigger text encoders and 12 billion parameters, FLUX.1 requires more VRAM than some other models (although it is similar to Stable Diffusion 3 Medium). This means that you will need a beefier GPU to run it, with [8-bit quantized encoders](https://huggingface.co/docs/diffusers/main/en/api/pipelines/flux#single-file-loading-for-the-fluxtransformer2dmodel), it barely fits on flagship consumer GPUs with 24GB of VRAM. It might still cause problems on some generations if you are generating 2+ images at a time at 1024x1024 resolution.

## Conclusion

We like this one a lot. It has state of the art prompt adherence, it can do text, and it's open-source. We also like its general aesthetic significantly better than our current default model [Stable Diffusion 3 Medium](https://stablecog.com/blog/stable-diffusion-3-medium-the-successor-to-sdxl). So, we are making FLUX.1 the default model on [Stablecog](https://stablecog.com/) going forward.

## Give It A Try

You can try FLUX.1 on [Stablecog](https://stablecog.com/) right now! Just click the button below and see what it can do.
<Button class='mt-4' href="https://stablecog.com/generate?mi=0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b" target="_blank">
Try FLUX.1
</Button>
