---
title: What is Negative Prompt?
author: M. Yekta Güngör
description: Negative prompt is used for excluding certain things from the generated image. Learn more about it in our guide.
author_url: https://twitter.com/yektagg
date: 2023-04-18T15:00:00.000Z
---

<script>
  import Cards from '$components/docs/Cards.svelte';
  import Card from '$components/docs/Card.svelte';
</script>

# Negative Prompt

Negative prompt can be considered the opposite of a prompt. With prompt, you describe things that you would like to see in the generated image. With negative prompt, you can describe stuff that the model will try to exclude from the image.

For example, Stable Diffusion and various other fine-tuned models aren't best when it comes to generating images of hands. So you might have "hands" as you negative prompt to tell the model to steer away from trying to create hands. Or you can use "NSFW" as a negative prompt to tell the model to steer away from creating NSFW images.

## Negative Prompt Examples

Two generations below have the exact same settings except for the negative prompt. The left one doesn't have any negative prompts. Right one has "green tones" as the negative prompt. Notice how the model tries to steer away from green tones in the right one.

<Cards>
  <Card size='wider' title="No negative prompt" src="https://ba.stablecog.com/guide/generation-settings/negative_prompt_none.jpg" width="1024" height="1536"/>
  <Card size='wider' title="Negative prompt: Green tones" src="https://ba.stablecog.com/guide/generation-settings/negative_prompt_green_tones.jpg" width="1024" height="1536"/>
  <Card size='wider' title="No negative prompt" src="https://ba.stablecog.com/guide/generation-settings/negative_prompt_2_none.jpg" width="1024" height="1536"/>
  <Card size='wider' title="Negative prompt: Angry" src="https://ba.stablecog.com/guide/generation-settings/negative_prompt_2_angry.jpg" width="1024" height="1536"/>
</Cards>
