---
title: Voiceover Defaults
description: Learn how to retrive the defaults for the voiceover operation using Stablecog API.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
date: 2023-06-21T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/defaults.jpg
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

# Voiceover Defaults

<RequestLine method='GET'>
	/v1/audio/voiceover/defaults
</RequestLine>

This endpoint is for retrieving for the voiceover operation.

## Request Example

Below is an example for retrieving the defaults for the voiceover operation.

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

<Property name="model_id" type="TVoiceoverModelID" typeModifier="enum">
	The ID of the default voiceover model.
	<Expandible title="TVoiceoverModelID" yPadding>
		You can get the list of available models from the <Code href='/docs/v1/api-reference/audio/voiceover/models'>/v1/audio/voiceover/models</Code> endpoint.
	</Expandible>
</Property>
<Property name="scheduler_id" type="TVoiceoverSpeakerID" typeModifier="enum">
	The ID of the default speaker.
	<Expandible title="TVoiceoverSpeakerID" yPadding>
		You can get the list of available speaker IDs from the <Code href='/docs/v1/api-reference/audio/voiceover/models'>/v1/audio/voiceover/models</Code> endpoint.
	</Expandible>
</Property>
<Property name="temperature" type="float" min={0} max={1}>
	The default temperature for the voiceover operation.
</Property>
<Property name="denoise_audio" type="boolean">
	The default value for denoise audio for the voiceover operation.
</Property>
<Property name="remove_silence" type="boolean">
	The default value for remove silence for the voiceover operation.
</Property>
