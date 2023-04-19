---
title: What is a Scheduler?
description: The scheduler controls the entire denoising process in which the model generates (diffuses) the image. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/guide/previews/scheduler.jpg
---

# Scheduler

The scheduler controls the entire denoising process in which the model generates (diffuses) the image. This process is usually a trade-off between speed and quality. Some schedulers' result might appear more "creative", some might be better at small details, some might be very good at fewer inference steps while not having a meaningful difference in quality at higher inference steps.

So, it is hard to name the "best" scheduler. It simply depends on what you are trying to create. Euler is a tried and true standard one. Euler Ancestral tends to be more creative and perform nicely as the inference steps go higher. DPM Multistep is good at fine details.

## Scheduler Examples

Below are 4 generations that have the exact same settings except for their schedulers. Some of them produces similar results while some are different.

| Euler                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------- |
| ![Euler](https://ba.stablecog.com/guide/generation-settings/scheduler_euler.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| Euler A.                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------- |
| ![Euler A.](https://ba.stablecog.com/guide/generation-settings/scheduler_euler_a.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| DPM Multistep                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------ |
| ![DPM Multistep](https://ba.stablecog.com/guide/generation-settings/scheduler_dpm_multistep.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->

| LMS                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------- |
| ![LMS](https://ba.stablecog.com/guide/generation-settings/scheduler_lms.jpg)<!--rehype:width=1024&height=1536--> |

<!--rehype:class=w-full md:w-1/2-->
