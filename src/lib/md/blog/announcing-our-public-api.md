---
title: Announcing Our Public API
description: Our public API is now available. Developers can utilize it to build applications that generate and upscale images using Stablecog's selection of AI image models.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
date: 2023-05-31T15:00:00.000Z
tags: api, developers, app, update
---

<script>
  import Button from '$lib/components/buttons/Button.svelte';
  import DocImage from '$lib/components/docs/DocImage.svelte';
</script>

We've been working on a public API so that other developers can integrate Stablecog's AI image models and leverage Stablecog's infrastructure to power txt2img in their own applications. It's been highly requested, and it's finally here :)

## A Simple API

We wanted the API to be as simple and easy to use as possible, and we think that we've achieved it. Developers can generate and upscale images with all of the same features as Stablecog's web interface. There are additional APIs for retrieving the available settings for various models, querying images with a variety of filters, and more.

<Button class="mt-4 mb-1" target="_blank" href="https://stablecog.com/docs">Visit Documentation</Button>

<DocImage src="https://ba.stablecog.com/blog/docs-v1.png" href="https://stablecog.com/docs" width="2880" height="2000" alt="Stablecog API Documentation" />

## Getting Started

The first step is to create an API token (you may create up to 10), this can easily be done from the [account page](https://stablecog.com/account/api-keys).

<Button class="mt-4 mb-2" target="_blank" href="https://stablecog.com/account/api-keys">Create API Keys</Button>

<DocImage src="https://ba.stablecog.com/blog/account-api-keys.png" href="https://stablecog.com/account/api-keys" width="2880" height="1600" alt="Stablecog API Keys" />

We have [extensive documentation](https://stablecog.com/docs) on how to use these APIs, as well as an [OpenAPI specification](https://github.com/stablecog/sc-go/blob/master/server/openapi_token.yaml) that allows developers to generate clients in their programming language of choice - or import the collection to a tool like [Postman](https://www.postman.com) to experiment with the APIs.

## Pricing

To start, [pricing](https://stablecog.com/pricing) is the exact same for the public API and the web interface. The same rules apply to the public API as they do the interface - such as the limits on parallel generations and public/private images.

<Button class="mt-4 mb-1" target="_blank" href="https://stablecog.com/pricing">Check Pricing</Button>

<DocImage src="https://ba.stablecog.com/blog/pricing-v2.png" href="https://stablecog.com/pricing" width="2880" height="2000" alt="Stablecog API Pricing" />

If your application has additional requirements than what's available in our standard subscriptions and credit packs feel free to [email us](mailto:hello@stablecog.com) and we will come up with a solution that fits your needs.

## Other Details

You can now view your account's usage on the [account page](https://stablecog.com/account/usage). This shows your history for both API usage and web application usage.

<Button class="mt-4 mb-1" target="_blank" href="https://stablecog.com/account/usage">View Your Usage</Button>

<DocImage src="https://ba.stablecog.com/blog/account-usage.png" href="https://stablecog.com/account/usage" width="2880" height="2000" alt="Stablecog Account Usage" />

## Reach Out

If you have any questions about the API, or if you have any feature requests, feel free to join our [Discord](https://stablecog.com/discord). We are happy to help.

Also, if you build something cool with the API, we'd love to hear about it! We have a [#dev-showcase](https://stablecog.com/discord) channel on Discord. You can also let us know through [Twitter](https://stablecog.com/twitter).

<Button class="mt-4 mb-1" target="_blank" href="https://stablecog.com/discord">Join Discord</Button>

## What's Coming Next?

With the public API, we will look into creating clients in various programming languages to make integration with Stablecog even easier for developers.

We also have the intention of adding other types of AI models to Stablecog besides image generation, such as text to speech models and large language models.
