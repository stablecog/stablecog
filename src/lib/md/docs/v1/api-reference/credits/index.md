---
title: Credits
description: Learn how to retrieve your remaining credits using the Stablecog API.
author: M. Yekta Güngör
author_url: https://twitter.com/ngyekta
date: 2023-05-26T15:00:00.000Z
preview_image_url: https://ba.stablecog.com/docs/previews/credits.jpg
---

<script>
	import Tabs from '$components/docs/tabs/Tabs.svelte';
	import Tab from '$components/docs/tabs/Tab.svelte';
	import RequestLine from '$components/docs/RequestLine.svelte';
	import Spacer from '$components/docs/Spacer.svelte';
	import Property from '$components/docs/Property.svelte';
	import Expandible from '$components/docs/Expandible.svelte';
  import CurlRequestSimple from './request/curl.md';
  import TypescriptRequestSimple from './request/typescript.md';
  import PythonRequestSimple from './request/python.md';
  import Response from './request/response.json';
  import CollapsibleJSON from '$components/docs/collapsibleJSON/CollapsibleJSON.svelte';
  import Code from '$components/docs/Code.svelte';
</script>

# Credits

<RequestLine method='GET'>
	/v1/credits
</RequestLine>

This endpoint is for listing your credits.

## Request Example

<Tabs>
	<Tab value="cURL">
		<CurlRequestSimple />
	</Tab>
	<Tab value="TypeScript">
		<TypescriptRequestSimple />
	</Tab>
	<Tab value="Python">
		<PythonRequestSimple />
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

<Property name="total_remaining_credits" type="int">
  Your total remaining credits.
</Property>
<Property name="credits" type="TCredit" typeModifier="array">
	Each credit you have.
  <Expandible title="TCredit">
		<Property name="id" type="string">
      The ID of this particular credit object.
    </Property>
    <Property name="remaining_amount" type="int">
      The remaining amount of this particular credit object.
    </Property>
    <Property name="expires_at" type="string">
      The expiry date of this particular credit object.
    </Property>
     <Property name="type" type="TCreditType" typeModifier="object">
        Type of this credit.
      <Expandible title="TCreditType">
        <Property name="id" type="string">
          The ID of this credit type.
        </Property>
        <Property name="name" type="string">
          The name of this credit type.
        </Property>
        <Property name="amount" type="int">
          The amount that this credit type comes by default.
        </Property>
        <Property name="description" type="string">
          The description of this credit type.
        </Property>
      </Expandible>
    </Property>
	</Expandible>
</Property>
