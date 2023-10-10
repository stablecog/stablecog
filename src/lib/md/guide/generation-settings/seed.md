---
title: What is Seed?
description: Seed is a way of initializing the random number generator that is used to generate the image. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-04-18T15:00:00.000Z
---

<script>
  import Cards from '$components/docs/Cards.svelte';
  import Card from '$components/docs/Card.svelte';
</script>

# Seed

A seed is a way of initializing the random number generator that is used to generate the image. It lets you reproduce the same result when you want to. All other settings being equal, if you use the same seed, you will get the same image. If you use a different seed, you will get a different image.

Although it is not a very common use case, it can come in handy with comparing various settings. For example, you can use the same seed for two different models and compare the results. Or you can use the same seed for two different schedulers and compare the results.

## Seed Examples

Two generations below have the exact same settings except for the seed. Left one has the seed of 415798970 and the right one has the seed of 1000097042. Notice how changing the seed results in a completely different image. These seeds can later be used to reproduce the same images.

<Cards>
  <Card size='wider' title="415798970" src="https://ba.stablecog.com/guide/generation-settings/seed_415798970.jpg" width="1024" height="1536"/>
  <Card size='wider' title="1000097042" src="https://ba.stablecog.com/guide/generation-settings/seed_1000097042.jpg" width="1024" height="1536"/>
  <Card size='wider' title="1602969464" src="https://ba.stablecog.com/guide/generation-settings/seed_2_1602969464.jpg" width="1024" height="1536"/>
  <Card size='wider' title="1720804046" src="https://ba.stablecog.com/guide/generation-settings/seed_2_1720804046.jpg" width="1024" height="1536"/>
</Cards>
