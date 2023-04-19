---
title: What is Guidance Scale?
description: Guidance scale controls how similar the generated image will be to the prompt. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/guide/previews/guidance-scale.jpg
---

# Guidance Scale

Guidance scale controls how similar the generated image will be to the prompt. A higher guidance scale means the model will try to generate an image that follows the prompt more strictly. A lower guidance scale means the model will have more creativity.

Guidance scale can also be thought of as "prompt strength". If the prompt strength is higher, then the model has less leeway to be more creative. The default value for guidance scale for various Stable Diffusion based models tends to be 7-7.5. We are using 7 on Stablecog.

## Guidance Scale Examples

Here is the same generation created with guidance scale set to 1, 3, 7 and 15. The prompt is: "Dark, moody, high contrast, an alien with a tomato head".

| Guidance Scale: 1                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------- |
| ![Guidance Scale: 1](https://ba.stablecog.com/guide/generation-settings/guidance_scale_1.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| Guidance Scale: 3                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------- |
| ![Guidance Scale: 3](https://ba.stablecog.com/guide/generation-settings/guidance_scale_3.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| Guidance Scale: 7                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------- |
| ![Guidance Scale: 7](https://ba.stablecog.com/guide/generation-settings/guidance_scale_7.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| Guidance Scale: 15                                                                                                                  |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| ![Guidance Scale: 15](https://ba.stablecog.com/guide/generation-settings/guidance_scale_15.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

Notice how and the lower guidance scale settings, the concept of "alien" and "tomato head" is barely there. However at higher values the model tries more of those concepts. However at 15, the model is trying too hard to follow the "tomato head" and "alien" concepts while not being able to keep up with "dark" and "moody".
