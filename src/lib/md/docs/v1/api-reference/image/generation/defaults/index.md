---
title: Generation Defaults
description: Learn how to retrive the defaults for the generate operation using Stablecog API.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/generation-defaults.jpg
---

<script>
	import TypescriptRequest from './request/typescript.md';
	import PythonRequest from './request/python.md';
	import CurlRequest from './request/curl.md';
	import Response from './request/response.json';
	import Tabs from '$components/docs/tabs/Tabs.svelte';
	import Tab from '$components/docs/tabs/Tab.svelte';
	import RequestLine from '$components/docs/RequestLine.svelte';
	import Spacer from '$components/docs/Spacer.svelte';
	import Property from '$components/docs/Property.svelte';
	import Expandible from '$components/docs/Expandible.svelte';
	import CollapsibleJSON from '$components/docs/collapsibleJSON/CollapsibleJSON.svelte';
	import Code from '$components/docs/Code.svelte';
</script>

# Generation Defaults

<RequestLine method='GET'>
	/v1/image/generation/defaults
</RequestLine>

This endpoint is for retrieving for the generation operation.

## Request Example

Below is an example for retrieving the defaults for the generation operation.

<Tabs>
	<Tab value="cURL">
		<CurlRequest />
	</Tab>
	<Tab value="TypeScript">
		<TypescriptRequest />
	</Tab>
	<Tab value="Python">
		<PythonRequest />
	</Tab>
</Tabs>

<CollapsibleJSON json={Response} title="Response"/>

<Spacer/>

## Response Body

<Property name="model_id" type="TGenerationModelID" typeModifier="enum">
	The ID of the default generation model.
	<Expandible title="TGenerationModelID" yPadding>
		You can get the list of available models from the <Code href='/docs/v1/api-reference/image/generation/models'>/v1/image/generation/models</Code> endpoint.
	</Expandible>
</Property>
<Property name="scheduler_id" type="TGenerationSchedulerID" typeModifier="enum">
	The ID of the default scheduler.
	<Expandible title="TGenerationSchedulerID" yPadding>
		You can get the list of available scheduler IDs for a given model from the <Code href='/docs/v1/api-reference/image/generation/models'>/v1/image/generation/models</Code> endpoint.
	</Expandible>
</Property>
<Property name="width" type="int" min={256} max={1024}>
	The default width for the generation operation.
</Property>
<Property name="height" type="int" min={256} max={1024}>
	The default height for the generation operation.
</Property>
<Property name="num_outputs" type="int" min={1} max={4}>
	The default number of output images for the generation operation.
</Property>
<Property name="guidance_scale" type="float" min={1} max={20}>
	The default number of output images for the generation operation.
</Property>
<Property name="inference_steps" type="int" min={10} max={50}>
	The default number of inference steps for the generation operation.
</Property>
<Property name="prompt_strength" type="float" min={0} max={1}>
	The default prompt strength for the generation operation.
</Property>
