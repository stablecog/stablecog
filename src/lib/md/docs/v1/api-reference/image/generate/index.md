---
title: Generate
description: Learn how to generate images using the Stablecog API.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/generate.jpg
---

<script>
	import TypescriptRequest from './request/typescript.md';
	import PythonRequest from './request/python.md';
	import CurlRequest from './request/curl.md';
	import Response from './request/response.md';
	import Tabs from '$components/docs/tabs/Tabs.svelte';
	import Tab from '$components/docs/tabs/Tab.svelte';
	import RequestLine from '$components/docs/RequestLine.svelte';
	import Spacer from '$components/docs/Spacer.svelte';
	import Property from '$components/docs/Property.svelte';
	import Expandible from '$components/docs/Expandible.svelte';
	import Code from '$components/docs/Code.svelte';
	import CollapsibleJSON from '$components/docs/collapsibleJSON/CollapsibleJSON.svelte';
	import response from '$md/docs/v1/api-reference/image/generate/request/response.json';
</script>

# Generate

<RequestLine method='POST'>
	/v1/image/generate
</RequestLine>

This endpoint is for generating images. Although it supports many parameters, in its simplest form, you just need to send a prompt and the system will use the defaults for the rest.

## Request Example

Below is the simplest example of generating an image. You just send a prompt and the system will use the defaults for the rest.

<Tabs>
	<Tab value="cURL">
		<CurlRequest />
	</Tab>
	<Tab value="Typescript">
		<TypescriptRequest />
	</Tab>
	<Tab value="Python">
		<PythonRequest />
	</Tab>
</Tabs>

<CollapsibleJSON json={response} title="Response" />

<Spacer/>

## Request Headers

<Property name="Authorization" required type="string">
	Send your API key as the value of this header in the following form:<br>
	<Code>{"Authorization: Bearer <YOUR_STABLECOG_API_KEY>"}</Code>.
</Property>

<Spacer/>

## Request Body

<Property name="prompt" required type="string">
	Tell the model what image to generate.
</Property>
<Property name="model_id" type="TGenerationModelID" typeModifier="enum">
	The model that will be used for generating the image.
  <Expandible title="TGenerationModelID" yPadding>
		You can get the list of available models from the <Code href='/docs/v1/api-reference/image/models/generate'>/v1/image/models/generate</Code> endpoint.
	</Expandible>
</Property>
<Property name="width" type="int">
	The width of the image.
</Property>
<Property name="height" type="int">
	The height of the image.
</Property>
<Property name="num_outputs" type="int">
	The number of images to generate.
</Property>
<Property name="guidance_scale" type="float">
	How similar the image will be to your prompt. Higher values make the image closer to your prompt and provides less creative freedom to the model.
</Property>
<Property name="scheduler_id" type="TGenerationSchedulerID" typeModifier="enum">
	Schedulers define the entire denoising process during diffusion.
	<Expandible title="TGenerationSchedulerID" yPadding>
		You can get the list of available scheduler IDs for a given model from the <Code href='/docs/v1/api-reference/image/models/generate'>/v1/image/models/generate</Code> endpoint.
	</Expandible>
</Property>
<Property name="inference_steps" type="int">
	How many steps will be taken to generate the image. Higher values usually provide more details (which isn't always a good thing) but take longer to generate.
</Property>
<Property name="seed" type="int">
	To get repeatable results. Same seed combined with same settings will generate the same image.
</Property>

<Spacer/>

## Response Body

<Property name="outputs" type="TOutput" typeModifier="array">
	Generated images.
	<Expandible title="TOutput" >
		<Property name="id" type="string">
			The ID of the output.
		</Property>
		<Property name="url" type="string">
			The URL of the output image.
		</Property>
	</Expandible>
</Property>
<Property name="remaining_credits" type="float">
	Your remaining credits after this request.
</Property>
<Property name="settings" type="TGenerationSettings" typeModifier="object">
	Settings for the generation. Useful if you are using the defaults and want to know what they are.
	<Expandible title="TGenerationSettings" >
		<Property name="model_id" type="TGenerationModelID" typeModifier="enum">
			The ID of the model.
		</Property>
		<Property name="scheduler_id" type="TGenerationSchedulerID" typeModifier="enum">
			The ID of the scheduler.
		</Property>
		<Property name="width" type="int">
			The width of the image.
		</Property>
		<Property name="height" type="int">
			The height of the image.
		</Property>
		<Property name="num_outputs" type="int">
			The number of images.
		</Property>
		<Property name="guidance_scale" type="float">
			The guidance scale for the generation.
		</Property>
		<Property name="inference_steps" type="int">
			The number of inference steps for the generation.
		</Property>
		<Property name="seed" type="int">
			The seed for the generation.
		</Property>
	</Expandible>
</Property>
