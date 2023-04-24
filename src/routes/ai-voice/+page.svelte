<script lang="ts" context="module">
	import '$css/ai-voice/style.css';
	import { page } from '$app/stores';
	import { canonicalUrl } from '$ts/constants/main';
	import MetaTag from '$components/MetaTag.svelte';
	import { onMount } from 'svelte';
	
	export let buttonDisabled = false;
	export let buttonAutoPlay = true;
	export let autoFocus = true;
	export let ariavaluenow = 0;
	export let ariavaluemin = 0;
	export let ariavaluemax = 100;

	onMount(async () => {
		
	});
</script>


<MetaTag
	title="History | Ai-Voice"
	description="See your generation history on Synthica (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="flex flex-col items-center bg-white bg-crosses min-h-full flex-1">
	<div class="py-2u 2xl:pb-6u 2xl:pt-3u max-w-screen-2xl w-full">
		<div class="-mb-2u">
			<section class="content relative max-w-screen-2xl bg-bottom bg-no-repeat">
				<div class="relative w-full flex flex-col xl:flex-row text-left gap-1u xl:gap-2u">
					<div class="xl:w-1/3 flex-shrink-0">
						<h3
							class="font-sans text-5xl block font-bold text-black flex-shrink-0 tracking-tight text-start">
							Prime Voice AI</h3><span
							class="font-serif block font-normal text-gray-700 max-w-xl mt-5 xl:mb-12 text-xl text-start">The
							most realistic and versatile AI speech software, ever. Eleven brings the most
							compelling, rich and lifelike voices to creators and publishers seeking the ultimate
							tools for storytelling.</span>
					</div>
					<div class="w-full -mb-1u xl:-mb-2u">
						<div class="flex flex-col items-stretch max-w-4xl"><span
								class="font-serif text-sm block font-light text-gray-500 ml-4 mb-2">Try entering
								any text or <button class="btn btn-xs btn-white btn-round">give me an
									idea</button></span>
							<div class="bg-white shadow-2xl rounded-md flex flex-col items-stretch relative">
								<div class="relative px-8 py-8 pb-11"><textarea autofocus={autoFocus}
										placeholder="Eleven lets you voice any length of text in top quality, all while automatically matching what is being said with how it’s being said. The model works best on longer texts, so type in at least a few sentences."
										rows="5" maxlength="333"
										class="font-serif text-lg bg-transparent p-0 resize-none w-full outline-none focus:ring-0 ring-0 border-none placeholder:text-gray-200"
										spellcheck="false"></textarea>
									<div class="absolute bottom-4 left-7"><button
											id="headlessui-listbox-button-P0-2" type="button"
											aria-haspopup="listbox" aria-expanded="false"
											data-headlessui-state=""
											class="relative cursor-pointer rounded-lg mb-2 text-left focus:outline-none focus-visible:border-gray-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300 sm:text-sm text-gray-700 text-base flex items-center"><svg
												xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
												fill="currentColor" aria-hidden="true"
												class="inline h-5 w-5 text-gray-200">
												<path fill-rule="evenodd"
													d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z"
													clip-rule="evenodd"></path>
											</svg> premade/Adam<svg xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
												class="h-5 w-5 text-gray-400">
												<path fill-rule="evenodd"
													d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
													clip-rule="evenodd"></path>
											</svg></button></div><span
										class="font-serif text-xs block font-normal text-gray-700 absolute right-8 bottom-6">0
										/ 333</span>
								</div>
								<div class="px-8 py-8 items-center border-t-2 border-gray-100/50">
									<div class="flex flex-row items-center w-full gap-3"><audio
											id="audio-player" autoplay={buttonAutoPlay}></audio><button type="button"
											disabled={buttonDisabled} aria-label="Play"
											class="btn btn-circle btn-primary btn-xl"><svg aria-hidden="true"
												viewBox="0 0 36 36"
												class="fill-white group-active:fill-white/80 h-4 w-4">
												<path
													d="M33.75 16.701C34.75 17.2783 34.75 18.7217 33.75 19.299L11.25 32.2894C10.25 32.8668 9 32.1451 9 30.9904L9 5.00962C9 3.85491 10.25 3.13323 11.25 3.71058L33.75 16.701Z">
												</path>
											</svg></button>
										<div class="w-full flex items-center slider-wrapper-lg disabled"
											style="position: relative;">
											<div class="slider-track-lg rounded slider-track slider-track-lg slider-track-0"
												style="position: absolute; left: 0px; right: 402px;"></div>
											<div class="slider-track-lg rounded slider-track slider-track-lg slider-track-1"
												style="position: absolute; left: 0px; right: 0px;"></div>
											<div tabindex="0" role="slider" aria-orientation="horizontal"
												aria-valuenow={ariavaluenow} aria-valuemin={ariavaluemin} aria-valuemax={ariavaluemax}
												class="thumb thumb-0 "
												style="position: absolute; touch-action: none; z-index: 1; left: 0px;">
												<div
													class="relative flex items-center text-gray-500 cursor-pointer">
													<div class="relative pb-1">
														<div class="relative">
															<div
																class="absolute -translate-y-1/2 -translate-x-1/2">
																<div
																	class="slider-thumb h-4 rounded-full w-1 bg-black">
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
											fill="currentColor" aria-hidden="true"
											class="w-5 h-5 flex-shrink-0 text-gray-400 hover:text-black cursor-pointer">
											<title>Say it differently</title>
											<path fill-rule="evenodd"
												d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
												clip-rule="evenodd"></path>
										</svg><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
											fill="currentColor" aria-hidden="true"
											class="w-5 h-5 flex-shrink-0 text-gray-400 opacity-75">
											<title>Download audio</title>
											<path
												d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z">
											</path>
											<path
												d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z">
											</path>
										</svg>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>


