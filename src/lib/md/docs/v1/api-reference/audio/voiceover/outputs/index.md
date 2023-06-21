---
title: Voiceover Outputs
description: Learn how to retrive the existing voiceovers using Stablecog API.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
date: 2023-06-21T15:00:00.000Z
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

# Voiceover Outputs

<RequestLine method='GET'>
	/v1/audio/voiceover/outputs
</RequestLine>

This endpoint is for retrieving for the voiceover operation.

<Spacer/>

## Request Headers

<Property name="Authorization" required type="string">
	Send your API key as the value of this header in the following form:<br>
	<Code>{"Authorization: Bearer <YOUR_STABLECOG_API_KEY>"}</Code>.
</Property>

<Spacer/>

## Request Example

Below is an example for retrieving the outputs of previously created voiceovers.

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

<Property name="total_count" type="int">
	The total number of voiceovers that have been created
</Property>
<Property name="outputs" type="TVoiceoverOutput" typeModifier="array">
	List of voiceovers and their outputs.
	<Expandible title="TVoiceoverOutput" >
		<Property name="id" type="string">
			The ID of the output.
		</Property>
		<Property name="audio_file_url" type="string">
			The URL of the output voiceover.
		</Property>
		<Property name="audio_duration" type="float">
			How long the resulting audio is in seconds.
		</Property>
		<Property name="is_favorited" type="boolean">
			Whether or not this voiceover has been favorited.
		</Property>
		<Property name="denoise_audio" type="boolean">
			The denoise_audio setting for this voiceover.
		</Property>
		<Property name="remove_silence" type="boolean">
			The remove_silence setting for this voiceover.
		</Property>
	</Expandible>
</Property>
<Property name="next" type="string">
	The cursor for the next page.
</Property>