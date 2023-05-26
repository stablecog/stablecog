---
title: Stable Diffusion Tools & Resources
description: Stable Diffusion is an AI model to generate images, bit like DALL-E and Midjourney but it's open source and free. Here are tools to help you get started.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2022-10-21T16:00:00.000Z
---

<script>
  import DocImage from '$components/docs/DocImage.svelte'
</script>

Stable Diffusion is an open source AI model to generate images. It is like DALL-E and Midjourney but open source, free for everyone to use, modify, and improve. In this article, I've curated some tools to help you get started with Stable Diffusion.

## Generation Tools

These tools let you create images using Stable Diffusion. Some have few options and are easier to use while some are a bit harder to use but come with a lot of options you can play with.

### [DreamStudio](http://dreamstudio.ai)

It's made by [Stability.ai](https://stability.ai), the team that funded the initial development of Stable Diffusion alongside other open source projects.

<DocImage src="https://ba.stablecog.com/blog/dreamstudio-beta.jpg" href="http://dreamstudio.ai" width="3000" height="2250" alt="DreamStudio" />

You can get started for free with [DreamStudio](http://dreamstudio.ai), then after you hit the limit it's roughly $10 for 1000 generations. It has plenty of options you can play with such as steps, CFG scale, sampler, model selection and batch generation. It also let's you generate images based on images you upload combined with the prompt you enter (which is usually called img2img).

### [AUTOMATIC1111's Web UI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)

A more advanced and open source tool with a plethora of options. You can run it using your own GPU. It's made by [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui).

<DocImage src="https://ba.stablecog.com/blog/automatic-webui.jpg" href="https://github.com/AUTOMATIC1111/stable-diffusion-webui" width="2400" height="1800" alt="AUTOMATIC1111's Web UI" />

It might look overwhelming at first, and installation process is a bit complicated but it's worth checking out if you have a GPU and want to experiment with more options.

It includes text to image generation, image to image generation, sampling steps, sampling method, CFG scale, inpainting, outpanting, custom models, art styles, face restoration, upscaling, training, checking point merging and many more options that is impractical to list here.

### [DiffusionBee](https://diffusionbee.com)

An app to use Stable Diffusion on M1/M2 Macs. You just [download](https://diffusionbee.com) and install the dmg and it's ready to go. It's made by the creators of [Liner.ai](https://liner.ai).

<DocImage src="https://ba.stablecog.com/blog/diffusionbee.jpg" href="https://diffusionbee.com" width="2400" height="1800" alt="DiffusionBee" />

It's easy to use with a good amount of options including text to image generation, image to image generation, sampling steps, sampling method, CFG scale, and art styles. Outpainting and inpaint is not supported at the time of writing even though there is a tab for it.

### [Stablecog](https://stablecog.com)

Well, this is the blog of Stablecog :). It's a free, open source and easy to use web app that lets you generate images using Stable Diffusion. It's [made by me](https://twitter.com/ngyekta).

<DocImage src="https://ba.stablecog.com/blog/stablecog.jpg" href="https://stablecog.com" width="2634" height="1756" alt="Stablecog" />

It doesn't require sign ups and doesn't have pre-determined limits. It is intended to be easy to use so the default mode only has width and height options.

You can activate the advanced mode from the settings to get access to guidance scale, sampling steps, negative prompt, and seed. You can also run it on your own server if you want to. However, it doesn't provide as many options as more complicated tools such as AUTOMATIC1111's web ui.

## Prompt Tools

Prompts are a way to tell the model what to generate. You can use text, images, or even audio. The model will then generate images based on the prompt. Here are some tools to help you create better prompts.

### [Lexica.art](https://lexica.art)

Lexica.art defines itself as "the Stable Diffusion search engine".

<DocImage src="https://ba.stablecog.com/blog/lexica-art.jpg" href="https://lexica.art" width="3000" height="2250" alt="Lexica.art" />

When you start using Stable Diffusion, you might realize quickly that you will need to be very specific to get high quality results. [Lexica.art](https://lexica.art) will help you achieve that. It is a great tool to browse images and see their corresponding prompt. You can also search for prompts and get images that match the prompt.

### [promptoMANIA](https://promptomania.com/stable-diffusion-prompt-builder)

This is a tool for building prompts. It has pre-defined categories you can choose from to build a prompt piece by piece.

<DocImage src="https://ba.stablecog.com/blog/promptomania.jpg" href="https://promptomania.com/stable-diffusion-prompt-builder" width="2399" height="1799" alt="promptoMANIA" />

You can pick artists styles, color palettes, lighting styles, post-processing styles, camera lens options and many more categories. Once you build a prompt you like, you can copy it and use it in a generation tool of your choice.

## Plugins

### [Stable Diffusion Photoshop Plugin](https://christiancantrell.com/#ai-ml)

This Photoshop plugin for Stable Diffusion lets you create AI generated images directly from Photoshop. It's made by [Christian Cantrell](https://christiancantrell.com/#ai-ml).

<DocImage src="https://ba.stablecog.com/blog/sd-photoshop-plugin.jpg" href="https://christiancantrell.com/#ai-ml" width="2560" height="1413" alt="Stable Diffusion Photoshop Plugin" />

You can use the plugin by connecting it to your [DreamStudio](http://dreamstudio.ai) account or by running your own local server which will require more work, but you won't need to pay for generations.

### [Stable Diffusion Blender Plugin](https://airender.gumroad.com/l/ai-render)

This Blender plugin for Stable Diffusion does a very similar thing to the Photoshop plugin above, just for Blender instead.

<DocImage src="https://ba.stablecog.com/blog/sd-blender-plugin.jpg" href="https://airender.gumroad.com/l/ai-render" width="2560" height="1440" alt="Stable Diffusion Blender Plugin" />

You connect your [DreamStudio](http://dreamstudio.ai) account and you are ready to go. However, keep in mind that you still need to pay DreamStudio for your image generations.

## Extra Resources

Here are some resources that you might want to check out if you want to go deeper into Stable Diffusion.

### [Aitrepreneur](https://www.youtube.com/c/Aitrepreneur/videos)

Aitrepreneur is a relatively small YouTube channel with great content on Stable Diffusion and other AI models. I followed his tutorial when using DreamBooth to train Stable Diffusion with my own photos.

<DocImage src="https://ba.stablecog.com/blog/aitrepreneur.jpg" href="https://www.youtube.com/c/Aitrepreneur/videos" width="2646" height="1724" alt="Aitrepreneur" />

### [r/StableDiffusion](https://www.reddit.com/r/StableDiffusion)

The community run subreddit for Stable Diffusion. It's a great place to see what others are doing with Stable Diffusion, share your own experiments and learn more about Stable Diffusion. [Stable Diffusion Reddit](https://www.reddit.com/r/StableDiffusion) has 70K+ members at the time of writing with usually 1K+ online.

<DocImage src="https://ba.stablecog.com/blog/r-stablediffusion.jpg" href="https://www.reddit.com/r/StableDiffusion" width="2436" height="1690" alt="r/StableDiffusion" />

### [Stable Diffusion Discord](https://discord.com/invite/stablediffusion)

There is also a Discord which has a lot of different channels for different interests. You can look at other people's creations for inspiration or ask anything about Stable Diffusion and get help from other community members. [Stable Diffusion Discord](https://discord.com/invite/stablediffusion) has 80K+ members at the time of writing with usually 10K+ online.

<DocImage src="https://ba.stablecog.com/blog/stable-diffusion-discord.jpg" href="https://discord.com/invite/stablediffusion" width="2598" height="1978" alt="Stable Diffusion Discord" />
