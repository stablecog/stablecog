---
title: 'Kandinsky 2.2: The Best Open-Source AI Image Model with a Permissive License'
description: Kandinsky 2.2 offers more realistic images, a higher base resolution (1024x1024), supports ControlNet, produces more detail and wider scenes.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-07-14T15:00:00.000Z
---

<script>
  import Button from '$lib/components/buttons/Button.svelte';
  import DocImage from '$lib/components/docs/DocImage.svelte';
</script>

The [team](https://github.com/ai-forever/Kandinsky-2#authors) behind Kandinsky released their latest model 2 days ago: [Kandinsky 2.2](https://github.com/ai-forever/Kandinsky-2). Kandinsky is known for its creativity and artistic results but with the new update, it seems to be going more towards realism by default. It offers a higher base resolution (1024x1024), supports [ControlNet](https://github.com/lllyasviel/ControlNet), produces wider scenes, and more detail in general. All while being released under a permissive, open-source license. Let's take a look at what it offers.

## More Realistic

[Kandinsky 2.1](https://stablecog.com/blog/kandinsky-v2-1-open-source-midjourney-alternative) is a very creative model that produces interesting art. Although it can produce realistic images, it is not its strong suit. [Kandinsky 2.2](https://github.com/ai-forever/Kandinsky-2) takes a similar approach to Midjourney v5 and goes more towards realism. It is still capable of producing creative images, but if you give no direction, it tends to produce realistic images by default.

Here is example with Kandinsky 2.1 on the left, and Kandinsky 2.2 on the right. Notice how 2.1 produces an almost painting-like image, while 2.2 produces a more realistic image when there is no mention of a style.

### "A cat on a boat"

<DocImage src="https://ba.stablecog.com/blog/a-cat-on-a-boat-kandinsky-2-1-vs-2-2.jpg" width="1664 " height="1248" alt="Kandinsky 2.1 vs 2.2: A cat on a boat" />

Here is another example with specific direction regarding realism. Aside from the obvious resolution difference, notice how 2.2 is able to create more realistic details, lighting, cloth texture and skin texture.

### "Artemis as a black woman, 90mm studio photo, hyperrealistic"

<DocImage src="https://ba.stablecog.com/blog/artemis-as-a-black-woman-kandinsky-2-1-vs-2-2.jpg" width="1664 " height="1248" alt="Kandinsky 2.1 vs 2.2: Artemis as a black woman, 90mm studio photo, hyperrealistic" />

<Button class='w-full mt-2 mb-2' href="https://stablecog.com/generate?mi=9fa49c00-109d-430f-9ddd-449f02e2c71a" target="_blank">
  Try Kandinsky 2.2
</Button>

## Higher Resolution

[Kandinsky 2.1](https://stablecog.com/blog/kandinsky-v2-1-open-source-midjourney-alternative) was trained on [768x768 pixel images](<(https://habr.com/ru/companies/sberbank/articles/747446/)>). Because of this, if you went too wider or taller, say 1280 pixel on one side, it would produce repeating details, double heads etc.

Kandinsky 2.2 on the other hand, is optimized to produce [1024x1024 pixel images](https://habr.com/ru/companies/sberbank/articles/747446/).

New version supports a wide range of aspect ratios without any doubling problems just like the old one which means you can go far wider or taller than 1024 pixels on one side.

### Examples #1

<DocImage src="https://ba.stablecog.com/blog/kandinsky-2-2-higher-resolution-v3.jpg" width="4096  " height="7428" alt="Kandinsky 2.2 High Resolution Examples" />

## More Detail, Wider Scenes

Kandinsky 2.2 is significantly better at fine details compared to 2.1 and seems to be favoring wider scenes in general. Kandinsky 2.1 is able to produce fine details on some scenes, especially close-ups, but it struggles when the shot gets wider or there is a need for too many fine details.

### Examples #2

<DocImage src="https://ba.stablecog.com/blog/kandinsky-2-2-wider-and-detailed-v3.jpg" width="4096  " height="5120" alt="Kandinsky 2.2 Wide & Detailed Examples" />

<Button class='w-full mt-2 mb-2' href="https://stablecog.com/generate?mi=9fa49c00-109d-430f-9ddd-449f02e2c71a" target="_blank">
  Try Kandinsky 2.2
</Button>

## ControlNet Support

Kandinsky 2.2 introduced support for much loved [ControlNet](https://github.com/lllyasviel/ControlNet). Although this isn't currently available on [Stablecog](https://stablecog.com/), it'll be soon. You can check out HuggingFace's docs to learn how to use [ControlNet with Kandinsky 2.2](https://huggingface.co/docs/diffusers/main/en/api/pipelines/kandinsky#imagetoimage-generation-with-controlnet-conditioning).

Below is an example of what it can achieve, from [HuggingFace's docs](https://huggingface.co/docs/diffusers/main/en/api/pipelines/kandinsky#imagetoimage-generation-with-controlnet-conditioning). You give the image on the left, and a prompt. Then in this exmaple, ControlNet creates a depth map to create a better image to image generation. Finally, it produces the image on the right.

### "A robot, 4k photo"

<DocImage src="https://ba.stablecog.com/blog/kandinsky-2-2-controlnet-huggingface-v2.jpg" width="1536 " height="768" alt="Kandinsky 2.2 with ControlNet from HuggingFace's example." />

## Permissive License

Lately, some open-source models have been switching to non-permissive, research only licenses. Some with unknown permissive license release schedules, some with no promise of a permissive license in the future. This means that you can't use those models for commercial purposes, such as a website of yours you are selling products on. That also means we can't host them on Stablecog. Two of the latests examples being DeepFloyd's [IF model](https://github.com/deep-floyd/IF/blob/develop/LICENSE-MODEL) and [SDXL](https://stability.ai/blog/sdxl-09-stable-diffusion) which is promised to be release under a permissive license in the future.

Kandinsky 2.2, just like 2.1, takes a different approach. It is released under [a permissive license](https://github.com/ai-forever/Kandinsky-2/blob/main/license) from the get go. This means that you can use it for commercial purposes, and we can host it right away on Stablecog.

<DocImage href="https://github.com/ai-forever/Kandinsky-2/blob/main/license" src="https://ba.stablecog.com/blog/kandinsky-2-2-license.png" width="2624  " height="1718" alt="Kandinsky 2.2 License" />

## Conclusion

Considering the improvements it offers in the realism department, a higher base resolution, significantly better fine detail, ControlNet support, and the lack of recent competition with permissive licenses, we think Kandinsky 2.2 is the best open-source AI image model currently available with a permissive license. Because of this, we are making it the default model on [Stablecog](https://stablecog.com/) going forward.

## Give It A Try

You can try Kandinsky 2.2 on [Stablecog](https://stablecog.com/) right now! Just click the button below and see what it can do.
<Button class='mt-4' href="https://stablecog.com/generate?mi=9fa49c00-109d-430f-9ddd-449f02e2c71a" target="_blank">
Try Kandinsky 2.2
</Button>
