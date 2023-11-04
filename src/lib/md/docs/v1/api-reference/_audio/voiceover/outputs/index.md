---
title: Voiceover Outputs
description: Learn how to retrive your voiceovers using Stablecog API.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
date: 2023-06-21T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/outputs.jpg
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

## Request Headers

<Property name="Authorization" required type="string">
	Send your API key as the value of this header in the following form:<br>
	<Code>{"Authorization: Bearer <YOUR_STABLECOG_API_KEY>"}</Code>.
</Property>

<Spacer/>

## Response Body

<Property name="total_count" type="int">
	The total number of voiceovers you have.
</Property>
<Property name="outputs" type="TVoiceoverOutput" typeModifier="array">
	An array of voiceovers and their outputs.
	<Expandible title="TVoiceoverOutput">
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
			Whether or not this voiceover output has been favorited.
		</Property>
		<Property name="voiceover" type="TVoiceover" typeModifier="object">
			The voiceover object this output belongs to.
			<Expandible title="TVoiceover">
				<Property name="id" type="string">
					The ID of the voiceover.
				</Property>
				<Property name="model_id" type="TVoiceoverModelID" typeModifier="enum">
					The ID of the voiceover model that was used to create this voiceover.
				</Property>
				<Property name="speaker" type="TVoiceoverSpeaker" typeModifier="object">
					The speaker object for this voiceover.
					<Expandible title="TVoiceoverSpeaker">
						<Property name="id" type="string">
							The ID of the speaker.
						</Property>
						<Property name="name" type="string">
							The name of the voiceover speaker.
						</Property>
					</Expandible>
				</Property>
				<Property name="denoise_audio" type="boolean">
					The denoise_audio setting for this voiceover.
				</Property>
				<Property name="remove_silence" type="boolean">
					The remove_silence setting for this voiceover.
				</Property>
				<Property name="temperature" type="float" min={0} max={1}>
					The temperature setting for this voiceover.
				</Property>
				<Property name="outputs" type="TVoiceoverOutput" typeModifier="array">
					The outputs of this voiceover.
					<Expandible title="TVoiceoverOutput">
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
							Whether or not this voiceover output has been favorited.
						</Property>
					</Expandible>
				</Property>
			</Expandible>
		</Property>
	</Expandible>
</Property>
<Property name="next" type="string">
	The cursor for the next page. If there is no next page, this will be omitted.
</Property>
