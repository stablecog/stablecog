---
title: Prompting Using Styles
description: Learn how to use art styles when prompting fine-tuned Stable Diffusion models and Kandinsky on Stablecog.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
---

<script>
  import Cards from '$components/docs/Cards.svelte';
  import Card from '$components/docs/Card.svelte';
</script>

# Styles

Using art styles is a great way to describe what you want in fewer words. Although you can mix and match styles, you can start with a single style then experiment with mixing styles after you get the hang of it.

Some fine-tuned Stable Diffusion models are made specifically for certain styles like Waifu Diffusion being made for anime images. These kinds of models can ignore some of these styles. However, more general models like Kandinsky and Stable Diffusion v1.5 can use these styles more effectively.

## Style Examples

The examples below are made with [Kandinsky v2.1](/guide/models/kandinsky).

<Cards>
  <Card title="Watercolor" src="https://ba.stablecog.com/guide/prompting/styles_watercolor.jpg" width="1024" height="1024"/>
  <Card title="Anime" src="https://ba.stablecog.com/guide/prompting/styles_anime.jpg" width="1024" height="1024"/>
  <Card title="Papercut" src="https://ba.stablecog.com/guide/prompting/styles_papercut.jpg" width="1024" height="1024"/>
  <Card title="Graffiti" src="https://ba.stablecog.com/guide/prompting/styles_graffiti.jpg" width="1024" height="1024"/>
  <Card title="Pop Art" src="https://ba.stablecog.com/guide/prompting/styles_pop_art.jpg" width="1024" height="1024"/>
  <Card title="Folk Art" src="https://ba.stablecog.com/guide/prompting/styles_folk_art.jpg" width="1024" height="1024"/>
  <Card title="Pencil Sketch" src="https://ba.stablecog.com/guide/prompting/styles_pencil_sketch.jpg" width="1024" height="1024"/>
  <Card title="Cartoon" src="https://ba.stablecog.com/guide/prompting/styles_cartoon.jpg" width="1024" height="1024"/>
  <Card title="Block Print" src="https://ba.stablecog.com/guide/prompting/styles_block_print.jpg" width="1024" height="1024"/>
</Cards>
