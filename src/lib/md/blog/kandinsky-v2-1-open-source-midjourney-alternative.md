---
title: 'Kandinsky v2.1: Open Source Midjourney Alternative'
description: An open-source and multilingual latent diffusion model that shows similarities to Midjourney's initial versions. It is now available on Stablecog!
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-06T15:00:00.000Z
---

[Kandinsky v2.1](https://github.com/ai-forever/Kandinsky-2) is an open-source and multilingual latent diffusion model. It is created by a [group of researchers](https://github.com/ai-forever/Kandinsky-2#authors) from Russia and have been gaining traction in the last couple of days.

## Open Source Midjourney Alternative

People have started calling it the open source Midjourney alternative. After some initial testing I agree, it reminds me of Midjourney's initial versions as well.

![Kandinsky](https://ba.stablecog.com/blog/kandinsky.jpg)<!--rehype:width=3840&height=3208-->
[Try Kandinsky](https://stablecog.com/?mi=22b0857d-7edc-4d00-9cd9-45aa509db093)<!--rehype:button=true&width-full=true-->

It's not based on Stable Diffusion, it's created from scratch. It's very good at different aspect ratios and resolutions. It doesn't seem to have the "doubling" problem some Stable Diffusion models have. It also produces artistic results without the need for long prompts.

## Features

It can create images from text and supports inpainting. More interesting, it lets you fuse multiple images and prompts together. Again, a bit like Midjourney but with more freedom.

![Kandinsky Image Fuse](https://ba.stablecog.com/blog/kandinsky-image-fuse-code.jpg)<!--rehype:width=2560&height=1122-->

It's also multilingual by design, and trained on a large multilingual set according to the authors. They also note that it was trained LAION HighRes dataset and the internal dataset of the research team.

## Minor Drawback

There doesn't seem to be a native way to change the seed for the generations currently. Although you can set a seed with [torch](https://pytorch.org/), changing the seed doesn't make as big of a difference as it does with other models. There is already an [issue](https://github.com/ai-forever/Kandinsky-2/issues/27) regarding this on the repository, the authors might answer soon.

## Try It Now

You can try it right away on Stablecog :)

[Try Kandinsky](https://stablecog.com/?mi=22b0857d-7edc-4d00-9cd9-45aa509db093)<!--rehype:button=true-->

Or you can check out the repository for instructions on how to run it locally: [ai-forever/Kandinsky-2](https://github.com/ai-forever/Kandinsky-2).
