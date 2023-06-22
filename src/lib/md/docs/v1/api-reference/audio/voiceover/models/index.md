---
title: Voiceover Models
description: Learn how to retrive the voiceover models using the Stablecog API.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/models.jpg
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

# Voiceover Models

<RequestLine method='GET'>
	/v1/audio/voiceover/models
</RequestLine>

This endpoint is for retrieving our voiceover models.

## Request Example

Below is an example for retrieving our voiceover models.

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

<Property name="models" type="TVoiceoverModel" typeModifier="array">
  An array of our voiceover models.
  <Expandible title="TVoiceoverModel">
		<Property name="id" type="string">
			The ID of the voiceover model.
		</Property>
		<Property name="name" type="string">
      The name of the voiceover model.
		</Property>           
		<Property name="is_default" type="boolean">
      Is this the default model for upscales.
		</Property>
		<Property name="available_speakers" type="TVoiceoverSpeaker" typeModifier="array">
			An array of our voiceover models.
			<Expandible title="TVoiceoverSpeaker">
				<Property name="id" type="string">
					The ID of the voiceover speaker.
				</Property>
				<Property name="name" type="string">
					The name of the voiceover speaker.
				</Property>                
			</Expandible>
		</Property>
	</Expandible>
</Property>
