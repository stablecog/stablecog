---
title: Generation Models
description: Learn how to retrive the generation models using the Stablecog API.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/generation-models.jpg
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

# Generation Models

<RequestLine method='GET'>
	/v1/image/models/generate
</RequestLine>

This endpoint is for retrieving our generation models.

## Request Example

Below is an example for retrieving our generation models.

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

<CollapsibleJSON json={Response} title="Response"/>

<Spacer/>

## Response Body

<Property name="models" type="TGenerationModel" typeModifier="array">
  An array of our generation models.
  <Expandible title="TGenerationModel">
		<Property name="id" type="string">
			The ID of the generation model.
		</Property>
		<Property name="name" type="string">
      The name of the generation model.
		</Property>
		<Property name="is_default" type="boolean">
      Is this the default model for generating images.
		</Property>
    <Property name="available_schedulers" type="TGenerationScheduler" typeModifier="array">
      An array of schedulers that are available for this model.
      <Expandible title="TGenerationScheduler">
        <Property name="id" type="string">
          The ID of the scheduler.
        </Property>
        <Property name="name" type="string">
          The name of the scheduler.
        </Property>  
      </Expandible>
    </Property> 
		<Property name="default_width" type="int">
      The default width for the generation model.
		</Property>
    <Property name="default_height" type="int">
      The default height for the generation model.
    </Property>               
	</Expandible>
</Property>
