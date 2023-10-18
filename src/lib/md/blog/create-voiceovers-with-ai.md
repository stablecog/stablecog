---
title: Create Voiceovers with AI Using Bark (Text to Audio Model)
description: You can create voiceovers on Stablecog now using a text-to-audio model called Bark. We have 7 languages and 36 speakers available in beta.
author: M. Yekta Güngör
author_url: https://twitter.com/yektagg
date: 2023-06-22T15:00:00.000Z
tags: voiceover, bark, text-to-audio, ai
---

<script>
  import Button from '$lib/components/buttons/Button.svelte';
  import DocImage from '$lib/components/docs/DocImage.svelte';
  import AudioPlayerListItem from "$lib/components/voiceover/audioPlayer/AudioPlayerListItem.svelte";
</script>

We finally have a text-to-audio model available on Stablecog and a new interface for voiceover models! This text-to-audio model is called Bark, made by [Suno](https://github.com/suno-ai/bark). We have 7 languages and 36 speakers [available in beta](https://stablecog.com/voiceover/generate).

## Create Voiceovers with AI

The process of creating voiceovers with AI works similar to image generation. You enter a text prompt, select a speaker and a language and click generate. If you like you can also set the "voice stability" which makes the voice more stable or more variable. We also have the ability to remove silence from audio and the ability to remove the background noise. Here is our new interface:

<DocImage src="https://ba.stablecog.com/blog/voiceover-paul.png" href="https://stablecog.com/voiceover/generate" target="_blank" width="2880" height="1800" alt="Stablecog Voiceover Interface" />

Here is an example you can listen to. It is voiced by Rachel:

<div class='w-full py-4'>
  <AudioPlayerListItem noLayoutChange noDownloadButton output={{
    "id": "1",
    "audio_file_url": "https://ba.stablecog.com/blog/voiceover-rachel-technology-is-a-bridge.mp3",
    "audio_duration": 4,
    "voiceover": {
      "model_id": "0f442a3e-cf53-490b-b4a9-b0dda63e9523",
      "outputs": [{"id": "1"}],
      "prompt": {
        "text": "Technology is a bridge between imagination and reality.",
        "status": "succeeded",
      },
      "speaker": { "id": "4a19f17c-eedc-4cf8-a45d-1f9d69547125" }
    }
  }}/>
</div>

<Button class="mt-2 mb-5" target="_blank" href="https://stablecog.com/voiceover/generate">Create Voiceovers</Button>

## What is Bark?

Bark is an open-source, transformer-based text-to-audio model created by [Suno](https://github.com/suno-ai/bark). It is quite popular, 21.9K stars on GitHub.

<DocImage src="https://ba.stablecog.com/blog/github-suno-bark.png" href="https://github.com/suno-ai/bark" target="_blank" width="2560" height="2351" alt="Suno's Bark Model on Github" />

It can create realistic speech in various languages. It is also able to generate music and simple sound effects in some cases. For example, you can make the speaker laugh using "[laugh]".

Here is an example with the prompt: "I wouldn't say so [laugh].":

<div class='w-full py-4'>
  <AudioPlayerListItem noLayoutChange noDownloadButton output={{
    "id": "2",
    "audio_file_url": "https://ba.stablecog.com/blog/voiceover-paul-i-wouldnt-say-so.mp3",
    "audio_duration": 4,
    "voiceover": {
      "model_id": "0f442a3e-cf53-490b-b4a9-b0dda63e9523",
      "outputs": [{"id": "2"}],
      "prompt": {
        "text": "I wouldn't say so [laugh].",
        "status": "succeeded",
      },
      "speaker": { "id": "82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff" }
    }
  }}/>
</div>

## Create Voiceovers with Our API

The voiceover feature is also available on [our API](https://stablecog.com/docs/v1/api-reference/audio/voiceover). It supports all the same functionality that is available in the UI.

<Button class="mt-3 mb-1" target="_blank" href="https://stablecog.com/docs/v1/api-reference/audio/voiceover">Documentation</Button>

<DocImage src="https://ba.stablecog.com/blog/docs-create-voiceover.png" href="https://stablecog.com/docs/v1/voiceovers" target="_blank" width="2880" height="1800" alt="Create Voiceovers with Stablecog API" />

## What's Coming Next?

This marks a new beginning for Stablecog. We intend Stablecog to be a suite of AI powered open-source tools for creators, regardless of which language they speak. Next, we'll create the long requested [Discord](https://stablecog.com/discord) bot. Afterwards, we'll be experimenting with animations and writing.

## Start Creating Voiceovers

You can start creating voiceovers on Stablecog now. Join our [Discord](https://stablecog.com/discord) to let us know how it goes. Click the button below and start creating!

<Button class="mt-4 mb-1" target="_blank" href="https://stablecog.com/voiceover/generate">Create Voiceovers</Button>
