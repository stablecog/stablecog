---
title: What is Negative Prompt?
author: M. Yekta Güngör
description: Negative prompt is used for excluding certain things from the generated image. Learn more about it in our guide.
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/guide/previews/negative-prompt.jpg
---

# Negative Prompt

Negative prompt can be considered the opposite of a prompt. With prompt, you describe things that you would like to see in the generated image. With negative prompt, you can describe stuff that the model will try to exclude from the image.

For example, Stable Diffusion and various other fine-tuned models aren't best when it comes to generating images of hands. So you might have "hands" as you negative prompt to tell the model to steer away from trying to create hands. Or you can use "NSFW" as a negative prompt to tell the model to steer away from creating NSFW images.

### Negative Prompt Example

Two generations below have the exact same settings except for the negative prompt. The left one doesn't have any negative prompts. Right one has "green tones" as the negative prompt. Notice how the model tries to steer away from green tones in the right one.

| None                                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------- |
| ![No negative prompt](https://ba.stablecog.com/guide/generation-settings/negative_prompt_none.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| Green tones                                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Negative prompt: green tones](https://ba.stablecog.com/guide/generation-settings/negative_prompt_green_tones.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->
