---
title: Generation Outputs
description: Learn how to retrive your generation outputs using the Stablecog API.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/outputs.jpg
---

<script>
	import TypescriptRequest from './request/typescript.md';
	import PythonRequest from './request/python.md';
	import CurlRequest from './request/curl.md';
	import response from './request/response.json';
	import Tabs from '$components/docs/tabs/Tabs.svelte';
	import Tab from '$components/docs/tabs/Tab.svelte';
	import RequestLine from '$components/docs/RequestLine.svelte';
	import Spacer from '$components/docs/Spacer.svelte';
	import Property from '$components/docs/Property.svelte';
	import Expandible from '$components/docs/Expandible.svelte';
	import Code from '$components/docs/Code.svelte';
	import CollapsibleJSON from '$components/docs/collapsibleJSON/CollapsibleJSON.svelte';
</script>

# Generation Outputs

<RequestLine method='GET'>
	/v1/image/generation/outputs
</RequestLine>

This endpoint is for retrieving your generation outputs. Although it supports many query parameters, in its simplest form, you just need to do a GET request to the endpoint.

## Request Example

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

<CollapsibleJSON json={response} title="Response" />

<Spacer/>

## Request Headers

<Property name="Authorization" required type="string">
	Send your API key as the value of this header in the following form:<br>
	<Code>{"Authorization: Bearer <YOUR_STABLECOG_API_KEY>"}</Code>.
</Property>

<Spacer/>

## Query Parameters

<Property name="cursor" type="string">
	This is used for pagination. You can get the next page by sending the cursor called <Code>next</Code> in the previous page result.
</Property>

<Spacer/>

## Response Body

<Property name="total_count" type="int">
	The total number of outputs you have.
</Property>
<Property name="next" type="string">
	The cursor for getting the next page of outputs. If there is no next page, this property won't exist.
</Property>
<Property name="outputs" type="TOutputFull" typeModifier="array">
	Generated images.
	<Expandible title="TOutputFull" >
		<Property name="id" type="string">
			The ID of the output.
		</Property>
		<Property name="image_url" type="string">
			The URL of the output image.
		</Property>
		<Property name="gallery_status" type="TGalleryStatus" typeModifier="enum">
			The gallery status of the output showing if it's submitted to the public gallery, approved etc. It can be <Code>not_submitted</Code>, <Code>submitted</Code>, <Code>approved</Code> or <Code>rejected</Code>.
		</Property>
		<Property name="is_favorited" type="boolean">
			Is the output favorited by the user?
		</Property>
		<Property name="was_auto_submitted" type="boolean">
			Was the output submitted to the public gallery automatically? This is only relevant if you have a free account, otherwise generations won't be automatically submitted.
		</Property>
		<Property name="generation" type="TGeneration" typeModifier="object">
			The full generation object this output belongs to (since you can have more than 1 output per generation).
			<Expandible title="TGeneration">
				<Property name="id" type="string">
					The ID of generation.
				</Property>
				<Property name="model_id" type="TGenerationModelID" typeModifier="enum">
					The ID of the model.
					<Expandible title="TGenerationModelID" yPadding>
						You can get the list of available models from the <Code href='/docs/v1/api-reference/image/generation/models'>/v1/image/generation/models</Code> endpoint.
					</Expandible>
				</Property>
				<Property name="width" type="int" min={256} max={1024}>
					The width of the image.
				</Property>
				<Property name="height" type="int" min={256} max={1024}>
					The height of the image.
				</Property>
				<Property name="prompt" type="TPrompt" typeModifier="object">
					The prompt object.
					<Expandible title="TPrompt">
						<Property name="id" type="string">
							The ID of the prompt.
						</Property>
						<Property name="text" type="string">
							The text content of the prompt.
						</Property>
					</Expandible>
				</Property>
				<Property name="num_outputs" type="int" min={1} max={4}>
					The number of images.
				</Property>
				<Property name="guidance_scale" type="float" min={1} max={20}>
					The guidance scale for the generation.
				</Property>
				<Property name="inference_steps" type="int" min={10} max={50}>
					The number of inference steps for the generation.
				</Property>
				<Property name="scheduler_id" type="TGenerationSchedulerID" typeModifier="enum">
					The ID of the scheduler.
					<Expandible title="TGenerationSchedulerID" yPadding>
						You can get the list of available scheduler IDs for a given model from the <Code href='/docs/v1/api-reference/image/generation/models'>/v1/image/generation/models</Code> endpoint.
					</Expandible>
				</Property>
				<Property name="seed" type="int">
					The seed for the generation.
				</Property>
				<Property name="outputs" type="TOutput" typeModifier="array">
					Outputs of the generation.
					<Expandible title="TOutput">
						<Property name="id" type="string">
							The ID of the output.
						</Property>
						<Property name="image_url" type="string">
							The URL of the output image.
						</Property>
						<Property name="gallery_status" type="TGalleryStatus" typeModifier="enum">
							The gallery status of the output showing if it's submitted to the public gallery, approved etc. It can be <Code>not_submitted</Code>, <Code>submitted</Code>, <Code>approved</Code> or <Code>rejected</Code>.
						</Property>
						<Property name="is_favorited" type="boolean">
							Is the output favorited by the user?
						</Property>
						<Property name="was_auto_submitted" type="boolean">
							Was the output submitted to the public gallery automatically? This is only relevant if you have a free account, otherwise generations won't be automatically submitted.
						</Property>
					</Expandible>
				</Property>
			</Expandible>
		</Property>
	</Expandible>
</Property>
