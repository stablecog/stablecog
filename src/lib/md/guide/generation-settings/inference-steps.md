---
title: What is Inference Steps?
description: Inference steps controls how many steps will be taken during the generation process. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/guide/previews/inference-steps.jpg
---

# Inference Steps

Stable Diffusion starts with an image that consists of random noise. Then it continously denoises this image over and over again to steer it to the direction of your prompt. Inference steps controls how many steps will be taken during this process. The higher the value, the more steps that are taken to produce the image (also more time).

Although it is sometimes seen as a "quality slider" it's not necessarily that. Because after a certain number of steps, certain models in certain configurations will start introducing details that you might not like. The sweet spot for speed vs quality differs for each [scheduler](/guide/generation-settings/scheduler) but 30 is usually a good starting point to experiment.

### Inference Steps Example

Here is the same generation created with 5, 10, 20, 30, 40 and 50 inference steps.

| Steps: 5                                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------- |
| ![Inference Steps: 5](https://ba.stablecog.com/guide/generation-settings/inference_steps_5.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2 lg:w-1/3-->

| Steps: 10                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- |
| ![Inference Steps: 10](https://ba.stablecog.com/guide/generation-settings/inference_steps_10.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2 lg:w-1/3-->

| Steps: 20                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- |
| ![Inference Steps: 20](https://ba.stablecog.com/guide/generation-settings/inference_steps_20.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2 lg:w-1/3-->

| Steps: 30                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- |
| ![Inference Steps: 30](https://ba.stablecog.com/guide/generation-settings/inference_steps_30.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2 lg:w-1/3-->

| Steps: 40                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- |
| ![Inference Steps: 40](https://ba.stablecog.com/guide/generation-settings/inference_steps_40.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2 lg:w-1/3-->

| Steps: 50                                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- |
| ![Inference Steps: 50](https://ba.stablecog.com/guide/generation-settings/inference_steps_50.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2 lg:w-1/3-->

As you can see the image lacks detail at 5 and 10 steps but around 30 steps, detail is good. Although it can change from example to example and from scheduler to scheduler, we prefer 40 steps in this example because the extra detailed added at 50 steps made the image less pleasing to our eyes (it also took more time). This is why inference steps is not necessarily a "quality" slider.
