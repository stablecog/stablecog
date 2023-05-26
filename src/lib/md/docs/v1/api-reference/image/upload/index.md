---
title: Upload
description: Learn how to upload images using the Stablecog API.
author: Brandon Berhent
author_url: https://twitter.com/bbedward_real
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
	import response from '$md/docs/v1/api-reference/image/upload/request/response.json';
</script>

# Generate

<RequestLine method='POST'>
	/v1/image/upload
</RequestLine>

This endpoint is for uploading images. The result is intended to be used as init_image_url for the <Code href='/docs/v1/api-reference/image/generate'>/v1/image/generate</Code> endpoint.

## Request Example

Below is the simplest example of uploading an image. It takes a multipart/form-data request.

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

## Form Body

<Property name="file" required type="binary">
	The file to upload.
</Property>

<Spacer/>

## Response Body

<Property name="object" type="string">
	A URL that can be passed as init_image_url to the <Code href='/docs/v1/api-reference/image/generate'>/v1/image/generate</Code> endpoint.
</Property>