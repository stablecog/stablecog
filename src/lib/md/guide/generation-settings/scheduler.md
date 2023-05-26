---
title: What is a Scheduler?
description: The scheduler controls the entire denoising process in which the model generates (diffuses) the image. Learn more about it in our guide.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-04-18T15:00:00.000Z
---

<script>
  import Cards from '$components/docs/Cards.svelte';
  import Card from '$components/docs/Card.svelte';
</script>

# Scheduler

The scheduler controls the entire denoising process in which the model generates (diffuses) the image. This process is usually a trade-off between speed and quality. Some schedulers' result might appear more "creative", some might be better at small details, some might be very good at fewer inference steps while not having a meaningful difference in quality at higher inference steps.

So, it is hard to name the "best" scheduler. It simply depends on what you are trying to create. Euler is a tried and true standard one. Euler Ancestral tends to be more creative and perform nicely as the inference steps go higher. DPM Multistep is good at fine details.

## Scheduler Examples

Below are 4 generations that have the exact same settings except for their schedulers. Some of them produces similar results while some are different.

<Cards>
  <Card size='wider' title="Euler" src="https://ba.stablecog.com/guide/generation-settings/scheduler_euler.jpg" width="1024" height="1536"/>
  <Card size='wider' title="Eulear A." src="https://ba.stablecog.com/guide/generation-settings/scheduler_euler_a.jpg" width="1024" height="1536"/>
  <Card size='wider' title="DPM Multistep" src="https://ba.stablecog.com/guide/generation-settings/scheduler_dpm_multistep.jpg" width="1024" height="1536"/>
  <Card size='wider' title="LMS" src="https://ba.stablecog.com/guide/generation-settings/scheduler_lms.jpg" width="1024" height="1536"/>
</Cards>
