---
title: What is Guidance Scale?
description: Guidance scale controls how similar the generated image will be to the prompt. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
---

<script>
  import Cards from '$components/docs/Cards.svelte';
  import Card from '$components/docs/Card.svelte';
</script>

# Guidance Scale

Guidance scale controls how similar the generated image will be to the prompt. A higher guidance scale means the model will try to generate an image that follows the prompt more strictly. A lower guidance scale means the model will have more creativity.

Guidance scale can also be thought of as "prompt strength". If the prompt strength is higher, then the model has less leeway to be more creative. The default value for guidance scale for various Stable Diffusion based models tends to be 7-7.5. We are using 7 on Stablecog.

## Guidance Scale Examples

Here is the same generation created with guidance scale set to 1, 3, 7 and 15. The prompt is: "Dark, moody, high contrast, an alien with a tomato head".

<Cards>
  <Card size="wider" title="Guidance Scale 1" src="https://ba.stablecog.com/guide/generation-settings/guidance_scale_1.jpg" width="1024" height="1536"/>
  <Card size="wider" title="Guidance Scale 3" src="https://ba.stablecog.com/guide/generation-settings/guidance_scale_3.jpg" width="1024" height="1536"/>
  <Card size="wider" title="Guidance Scale 7" src="https://ba.stablecog.com/guide/generation-settings/guidance_scale_7.jpg" width="1024" height="1536"/>
  <Card size="wider" title="Guidance Scale 15" src="https://ba.stablecog.com/guide/generation-settings/guidance_scale_15.jpg" width="1024" height="1536"/>
</Cards>

Notice how and the lower guidance scale settings, the concept of "alien" and "tomato head" is barely there. However at higher values the model tries more of those concepts. However at 15, the model is trying too hard to follow the "tomato head" and "alien" concepts while not being able to keep up with "dark" and "moody".
