---
title: Our First Big Update
description: We've been working on a big update to our systems to make Stablecog faster, mor robust and sustainable. It's finally here! We have a new system, a new pricing model, a new default model and new schedulers.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-03-10T13:00:00.000Z
tags: app, update, ai
---

<script>
  import Button from '$components/buttons/Button.svelte'
  import DocImage from '$components/docs/DocImage.svelte'
</script>

We've been working on a big update to our systems to make Stablecog faster, more robust, and sustainable. It's finally here! Here's what's new.

## A Better System

We've overhauled our system to make it more robust and scalable. We're also using NVIDIA A100s now, which are significantly faster. Since they are so fast, we can finally make generating 4 images at a time the default. We've made the new system open-source like before: [github.com/stablecog](https://github.com/stablecog).

## A Better User Experience

The new interface keeps track of your generations or upscales regardless of which page you are on which means you can start a generation or an upscale, visit other pages you like and come back to see the results. It also saves the results of your previous actions. So if you visited history, then another page, and then came back to history, you'll see your history load instantly.

## Using Cloud Storage

We have been storing pro users' generations on cloud since the start, and started storing free generations on cloud about a month ago. Now, we are switching to cloud completely. [History page](https://stablecog.com/history) will now show you all your generations, not just the ones that are saved locally to your browser.

## New Pricing Model

Turns out, offering tens of thousands of generations to everyone for free wasn't sustainable :) We weren't only losing money on free users but even our pro plan's price wasn't enough to cover the GPU cost a pro user generates on average (let alone any other cost we have).

Going forward, we are switching to an image based pricing model which align our incentives better. We are still offering free generations to everyone, but in a sustainable way. You can also [participate in our events](https://stablecog.com/discord) to get more free generations.

<Button class="mt-5" href='https://stablecog.com/pricing' target="_blank">Check Out Plans</Button>

<DocImage src="https://ba.stablecog.com/blog/plans.jpg" width="2560" height="1200" alt="New Plans" />

If you are a pro user and aren't happy with the new plans, please email us at [hello@stablecog.com](mailto:hello@stablecog.com) and we'll work something out.

## New Default Model

Our new default model is Luna Diffusion, created by [@proximasan](https://twitter.com/proximasan). It's a more stylized model that is good at a variety of styles while not requiring long prompts. Using longer prompts, you can tweak the model to a style of your choice.

<DocImage src="https://ba.stablecog.com/blog/luna-diffusion.jpg" width="2560" height="1440" alt="Luna Diffusion" />

## New Schedulers

We've added two new schedulers: "DPM Multistep" and "DPM Singlestep". These schedulers are good at small details.

## Upcoming Features

Now that we have a better system and our incentives are aligned, we can focus on adding new features fast. Image to image generation, outpainting with a canvas, a semantically searchable gallery, gallery likes, usernames, and more are coming soon.
