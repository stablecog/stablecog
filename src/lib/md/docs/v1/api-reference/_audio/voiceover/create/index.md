---
title: Create Voiceover
description: Learn how to create voiceovers using the Stablecog API.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/create.jpg
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

# Create Voiceover

<RequestLine method='POST'>
	/v1/audio/voiceover/create
</RequestLine>

This endpoint is for creating voiceovers. Although it supports many parameters, in its simplest form, you just need to send a prompt and the system will use the defaults for the rest.

## Request Example

Below is the simplest example of creating a voiceover. You just send a prompt and the system will use the defaults for the rest.

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

## Request Body

<Property name="prompt" required type="string">
	Tell the model what voiceover to generate.
</Property>
<Property name="model_id" type="TVoiceoverModelID" typeModifier="enum">
	The model that will be used for generating the voiceover.
  <Expandible title="TVoiceoverModelID" yPadding>
		You can get the list of available models from the <Code href='/docs/v1/api-reference/audio/voiceover/models'>/v1/audio/voiceover/models</Code> endpoint.
	</Expandible>
</Property>
<Property name="speaker_id" type="TVoiceoverSpeakerID" typeModifier="enum">
	The model that will be used for generating the voiceover.
  <Expandible title="TVoiceoverSpeakerID" yPadding>
		You can get the list of available speakers from the <Code href='/docs/v1/api-reference/audio/voiceover/models'>/v1/audio/voiceover/models</Code> endpoint.
	</Expandible>
</Property>
<Property name="temperature" type="float" min={0} max={1}>
	How diverse the voiceover will be. Higher values are make the voice more variable while lower make it more stable.
</Property>
<Property name="denoise_audio" type="boolean">
	Remove background noise from the generated voiceover.
</Property>
<Property name="remove_silence" type="boolean">
	Remove the silent sections from the generated voiceover.
</Property>

<Spacer/>

## Response Body

<Property name="outputs" type="TOutput" typeModifier="array">
	Generated voiceover outputs.
	<Expandible title="TOutput">
		<Property name="id" type="string">
			The ID of the output.
		</Property>
		<Property name="url" type="string">
			The URL of the output voiceover.
		</Property>
		<Property name="audio_duration" type="float">
			How long the resulting audio is in seconds.
		</Property>
	</Expandible>
</Property>
<Property name="remaining_credits" type="float">
	Your remaining credits after this request.
</Property>
<Property name="settings" type="TVoiceoverSettings" typeModifier="object">
	Settings for the generation. Useful if you are using the defaults and want to know what they are.
	<Expandible title="TVoiceoverSettings" >
		<Property name="model_id" type="TVoiceoverModelID" typeModifier="enum">
			The ID of the model.
			<Expandible title="TVoiceoverModelID" yPadding>
				You can get the list of available models from the <Code href='/docs/v1/api-reference/audio/voiceover/models'>/v1/audio/voiceover/models</Code> endpoint.
			</Expandible>
		</Property>
		<Property name="speaker_id" type="TVoiceoverSpeakerID" typeModifier="enum">
			The ID of the speaker.
			<Expandible title="TVoiceoverSpeakerID" yPadding>
				You can get the list of available speaker from the <Code href='/docs/v1/api-reference/audio/voiceover/models'>/v1/audio/voiceover/models</Code> endpoint.
			</Expandible>
		</Property>
		<Property name="temperature" type="float" min={0} max={1}>
			The temperature for the voiceover.
		</Property>
		<Property name="denoise_audio" type="boolean">
			The denoise option for the voiceover.
		</Property>
		<Property name="remove_silence" type="boolean">
			The remove silence option for the voiceover.
		</Property>
	</Expandible>
</Property>
