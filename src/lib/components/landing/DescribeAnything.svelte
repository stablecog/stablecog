<script lang="ts">
	import ImageWithOutlineAndPlaceholder from '$components/ImageWithOutlineAndPlaceholder.svelte';
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { themeApp } from '$ts/stores/theme';
	import { isSignedIn } from '$ts/stores/user/isSignedIn';
</script>

<section
	id="describe-anything"
	class="w-full lg:h-[calc(100svh-env(safe-area-inset-bottom)-10rem)] lg:min-h-[40rem]
		flex flex-col lg:flex-row items-center justify-between"
>
	<div
		class="flex-1 min-h-0 w-full lg:h-full flex flex-col lg:flex-row
			lg:items-center lg:justify-center justify-start items-center relative"
	>
		<div
			class="min-w-0 w-full h-auto lg:flex-1 lg:h-full relative flex justify-end lg:pr-0
				order-2 lg:order-1"
		>
			<div
				class="h-full relative pr-[6%] -ml-[6%] md:pr-[6%] md:-ml-[6%] lg:pr-0 lg:ml-0 overflow-hidden flex justify-end"
			>
				<div class="aspect-[5/4] h-full relative">
					<ImageWithOutlineAndPlaceholder
						style="
              -webkit-mask-image: url(/landing/cat/cat-mask.svg);
              mask-image: url(/landing/cat/cat-mask.svg);
              -webkit-mask-repeat: no-repeat;
              mask-repeat: no-repeat;
              mask-size: cover;
              -webkit-mask-size: cover;
              mask-position: right center;
              -webkit-mask-position: right center;
            "
						class="w-full h-full"
						srcset="
              /landing/cat/cat-512.webp 512w,
              /landing/cat/cat-768.webp 768w,
              /landing/cat/cat-1024.webp 1024w,
              /landing/cat/cat-1440.webp 1440w,
              /landing/cat/cat-1920.webp 1920w,
            "
						sizes="(min-width: 1024px) 50vw, 100vw"
						src="/landing/cat/cat-1920.webp"
						srcPlaceholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAIAAACZeshMAAADXklEQVR4ARVRNYDjRhT9f0ayJa3Zy8wYZmZmTqpU19cpk768LsxUh5l5mXnNjAJLGo0md/3jh7c9vaGidk+TsUJ776SViEqMm3uVLIBFEQzRQAjIKPmCcXAB0IQ6AYhCXxNK0qW3L5KGG0BhLVdH1Z5uJmRAdAaahhVTKOOWB7brAILkaq7jNZH5JZGyQO+FMXqd/8SsoDMPJ6Zm5FH0Y/EgTcCVSz0RojFC5m6bGhkbHuoZUMLqMuTtttstwuPBSwnIhtDpKN70ygvXjQVMHpGuvwJiWvDl174tGelzz1wxMheNLga+3MvrSqfl1M9au0Hb6SeXheXoUmTed33q1m+o0JHpWSWJ3smR+9aHJ79s//FDaU8ikcfuml1fcT797ptaPp2qsHrr12RX9ZHZcwQ4Ml8RSboUeOGX7bWVYkji2i9fVz7/+Q8B+TiQ709KvD1iqbXl0y+uv/L6aqNeMAzOxu6bnLO8wz8zh+DL9DLxgCxS3MSynkwXy7rTAk+RQJIgceP10y26US4N1PT2evrdLgy4QlFMLVOvZVmLYZ7eJ16KwXCrc1RqVFU5Fo8NRHgi5Gpj4Znnn5teP7CXN8r1yoov8v6F8ySVsm7V7gMQlOhSlWxW/dwwGe91J3XdLtY3GMMYTl136ZBXls/+StU6n0YkuVe6WvjcxXAbM9N0jPte58LaAQhnIHVz9MYn5q7pibZdwwNOmlxWA4mRHiWzcUgYeoARGkfP7PB907cH5csGhdsUKTpGbpBFkgmjbtpROraQHOhXei6N9iiulFzU2o0yrcVlkAvesgElDqgDIahO42za36Xz4rFLybVVXv3V/lk0412gOh27brm1Gk/OxwCc1FlWJ01TOIgCEW3IFP1yVL5JBaRX4IsNOOmHhSAktmDNtKVbr7gxqCmiFRwfH2rVC2e5tIu+g7YBeSY4QNQBk9PYCJmQ8rjqCFMWPZNkYgEuB/CFUgwHxJHjVC1JJLUymAZmKddHYaECnRrUJShn3e/jcg+dENf66HSwkRGnV/aOSZHa+c3zW9nUuvgx4+cvv+yJ4m62wQ4JSAooNchV4TQO4WmY0tEhGvYHxWBDlAywbnii//b7lsJwvcKHPFBYplcDOjAcIxdp5WPYa0FTBeUGuCcMYYuv/A+DT8sYIgQ3TwAAAABJRU5ErkJggg=="
						alt="Cat"
						width="1920"
						height="1536"
						classOutline="w-full h-full absolute right-0 top-0"
						srcOutline={$themeApp === 'light'
							? '/landing/cat/cat-outline-light.svg'
							: '/landing/cat/cat-outline-dark.svg'}
						altOutline="Cat Outline"
					/>
				</div>
			</div>
			<div
				class="absolute right-0 bottom-[15%] md:bottom-[20%] lg:bottom-[20%] w-full py-2 px-3 md:pl-8 md:pr-12 lg:pl-4 lg:pr-1 flex justify-end"
			>
				<p
					class="px-4 font-medium py-3 rounded-lg md:rounded-xl bg-c-bg-secondary text-xs
					md:text-base lg:text-lg lg:px-5 ring-2 ring-c-bg-tertiary shadow-xl
					shadow-c-shadow/[var(--o-shadow-stronger)]"
				>
					{$LL.Landing.Describe.Prompt()}
				</p>
			</div>
		</div>
		<div
			class="px-6 pt-6 pb-8 lg:pt-12 lg:pb-20 lg:w-2/5 xl:w-1/2 order-1 lg:order-2
				lg:pl-10 lg:pr-12 xl:pl-16 flex flex-col items-center lg:items-start"
		>
			<div class="flex flex-col items-center lg:items-start">
				<h2
					class="max-w-[19rem] md:max-w-[22rem] lg:max-w-[28rem] font-semibold text-3xl md:text-4xl
						lg:text-5xl flex-1 leading-tight lg:leading-tight text-center lg:text-left"
				>
					{$LL.Landing.Describe.Title()}
				</h2>
				<p
					class="max-w-[22rem] lg:max-w-[28rem] leading-relaxed md:text-lg lg:text-xl mt-2
					text-center lg:text-left text-c-on-bg/75"
				>
					{$LL.Landing.Describe.Paragraph()}
				</p>
				<Button
					href={$isSignedIn
						? `/generate?p=${encodeURIComponent($LL.Landing.Describe.Prompt())}`
						: `/generate?p=${encodeURIComponent($LL.Landing.Describe.Prompt())}&smo=true`}
					class="mt-6 w-full hidden md:block max-w-[15rem] px-6 md:px-8 py-4"
					noPadding
				>
					{$LL.Landing.TryItNowButton()}
				</Button>
			</div>
		</div>
	</div>
</section>
