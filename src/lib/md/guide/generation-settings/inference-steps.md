---
title: What is Inference Steps?
description: Inference steps controls how many steps will be taken during the generation process. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-04-18T15:00:00.000Z
---

<script>
  import Cards from '$components/docs/Cards.svelte';
  import Card from '$components/docs/Card.svelte';
</script>

# Inference Steps

Stable Diffusion starts with an image that consists of random noise. Then it continously denoises this image over and over again to steer it to the direction of your prompt. Inference steps controls how many steps will be taken during this process. The higher the value, the more steps that are taken to produce the image (also more time).

Although it is sometimes seen as a "quality slider" it's not necessarily that. Because after a certain number of steps, certain models in certain configurations will start introducing details that you might not like. The sweet spot for speed vs quality differs for each [scheduler](/guide/generation-settings/scheduler) but 30 is usually a good starting point to experiment.

## Inference Steps Examples

Here is the same generation created at 5, 10, 20, 30, 40 and 50 inference steps.

<Cards>
  <Card title="Inference Steps 5" src="https://ba.stablecog.com/guide/generation-settings/inference_steps_5.jpg" width="1024" height="1536"/>
  <Card title="Inference Steps 10" src="https://ba.stablecog.com/guide/generation-settings/inference_steps_10.jpg" width="1024" height="1536"/>
  <Card title="Inference Steps 20" src="https://ba.stablecog.com/guide/generation-settings/inference_steps_20.jpg" width="1024" height="1536"/>
  <Card title="Inference Steps 30" src="https://ba.stablecog.com/guide/generation-settings/inference_steps_30.jpg" width="1024" height="1536"/>
  <Card title="Inference Steps 40" src="https://ba.stablecog.com/guide/generation-settings/inference_steps_40.jpg" width="1024" height="1536"/>
  <Card title="Inference Steps 50" src="https://ba.stablecog.com/guide/generation-settings/inference_steps_50.jpg" width="1024" height="1536"/>
</Cards>

As you can see the image lacks detail at 5 and 10 steps but around 30 steps, detail is good. Although it can change from example to example and from scheduler to scheduler, we prefer 40 steps in this example because the extra detailed added at 50 steps made the image less pleasing to our eyes (it also took more time). This is why inference steps is not necessarily a "quality" slider.
