<script lang="ts">
	import ImageWithOutlineAndPlaceholder from '$components/utils/image/ImageWithOutlineAndPlaceholder.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';

	const placeholder =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAQCAIAAACZeshMAAADXklEQVR4ARVRNYDjRhT9f0ayJa3Zy8wYZmZmTqpU19cpk768LsxUh5l5mXnNjAJLGo0md/3jh7c9vaGidk+TsUJ776SViEqMm3uVLIBFEQzRQAjIKPmCcXAB0IQ6AYhCXxNK0qW3L5KGG0BhLVdH1Z5uJmRAdAaahhVTKOOWB7brAILkaq7jNZH5JZGyQO+FMXqd/8SsoDMPJ6Zm5FH0Y/EgTcCVSz0RojFC5m6bGhkbHuoZUMLqMuTtttstwuPBSwnIhtDpKN70ygvXjQVMHpGuvwJiWvDl174tGelzz1wxMheNLga+3MvrSqfl1M9au0Hb6SeXheXoUmTed33q1m+o0JHpWSWJ3smR+9aHJ79s//FDaU8ikcfuml1fcT797ptaPp2qsHrr12RX9ZHZcwQ4Ml8RSboUeOGX7bWVYkji2i9fVz7/+Q8B+TiQ709KvD1iqbXl0y+uv/L6aqNeMAzOxu6bnLO8wz8zh+DL9DLxgCxS3MSynkwXy7rTAk+RQJIgceP10y26US4N1PT2evrdLgy4QlFMLVOvZVmLYZ7eJ16KwXCrc1RqVFU5Fo8NRHgi5Gpj4Znnn5teP7CXN8r1yoov8v6F8ySVsm7V7gMQlOhSlWxW/dwwGe91J3XdLtY3GMMYTl136ZBXls/+StU6n0YkuVe6WvjcxXAbM9N0jPte58LaAQhnIHVz9MYn5q7pibZdwwNOmlxWA4mRHiWzcUgYeoARGkfP7PB907cH5csGhdsUKTpGbpBFkgmjbtpROraQHOhXei6N9iiulFzU2o0yrcVlkAvesgElDqgDIahO42za36Xz4rFLybVVXv3V/lk0412gOh27brm1Gk/OxwCc1FlWJ01TOIgCEW3IFP1yVL5JBaRX4IsNOOmHhSAktmDNtKVbr7gxqCmiFRwfH2rVC2e5tIu+g7YBeSY4QNQBk9PYCJmQ8rjqCFMWPZNkYgEuB/CFUgwHxJHjVC1JJLUymAZmKddHYaECnRrUJShn3e/jcg+dENf66HSwkRGnV/aOSZHa+c3zW9nUuvgx4+cvv+yJ4m62wQ4JSAooNchV4TQO4WmY0tEhGvYHxWBDlAywbnii//b7lsJwvcKHPFBYplcDOjAcIxdp5WPYa0FTBeUGuCcMYYuv/A+DT8sYIgQ3TwAAAABJRU5ErkJggg==';
	const mask =
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxNTM2IiB2aWV3Qm94PSIwIDAgMTkyMCAxNTM2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0xODQ1IDU1YzExMi44NyA2MCAyNi41IDIxMS41IDE4IDMxMnMzOCAxNTkgMzggMjg4LTYwIDIxMi41LTYwIDMzNyA0NS4yNSAzMTcuMjUtNTYgMzk0LTM0NS0xNi41LTQ3MyAwLTI1NiAxMjYtMzY5IDEyNi0yODAuNzUtMTEzLTQ0NS0xMTNjLTEzMS42MyAwLTMxOS42MyA3My42My0zOTUgMjAtNzUuMzgtNTMuNjMtMzEuNS0xNzgtNDUtMjk1UzE4IDk0NC4xMiAxOCA4MzJjMC0xMTIuMTMgMzEuNS0yMjUgNDctMzYzUy01Ljg0IDIxOCA4OSAxMDRzMzEwLjEzIDExLjM4IDQ0NyA1YzEzNi44OC02LjM4IDI1OC4yNS04NyA0MTAtODdzMjkyLjM3IDU5IDM4OCA1OWMxNzYuNzYgMCAzOTguMTItODYgNTExLTI2WiIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K';
	const outlineDark =
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxNTM2IiB2aWV3Qm94PSIwIDAgMTkyMCAxNTM2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGZpbHRlcj0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNMTg0NSA1NWMxMTIuODcgNjAgMjYuNSAyMTEuNSAxOCAzMTJzMzggMTU5IDM4IDI4OC02MCAyMTIuNS02MCAzMzcgNDUuMjUgMzE3LjI1LTU2IDM5NC0zNDUtMTYuNS00NzMgMC0yNTYgMTI2LTM2OSAxMjYtMjgwLjc1LTExMy00NDUtMTEzYy0xMzEuNjMgMC0zMTkuNjMgNzMuNjMtMzk1IDIwLTc1LjM4LTUzLjYzLTMxLjUtMTc4LTQ1LTI5NVMxOCA5NDQuMTIgMTggODMyYzAtMTEyLjEzIDMxLjUtMjI1IDQ3LTM2M1MtNS44NCAyMTggODkgMTA0czMxMC4xMyAxMS4zOCA0NDcgNWMxMzYuODgtNi4zOCAyNTguMjUtODcgNDEwLTg3czI5Mi4zNyA1OSAzODggNTljMTc2Ljc2IDAgMzk4LjEyLTg2IDUxMS0yNloiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAxIi8+CiAgPC9nPgogIDxwYXRoIGQ9Ik0xODQ1IDU1YzExMi44NyA2MCAyNi41IDIxMS41IDE4IDMxMnMzOCAxNTkgMzggMjg4LTYwIDIxMi41LTYwIDMzNyA0NS4yNSAzMTcuMjUtNTYgMzk0LTM0NS0xNi41LTQ3MyAwLTI1NiAxMjYtMzY5IDEyNi0yODAuNzUtMTEzLTQ0NS0xMTNjLTEzMS42MyAwLTMxOS42MyA3My42My0zOTUgMjAtNzUuMzgtNTMuNjMtMzEuNS0xNzgtNDUtMjk1UzE4IDk0NC4xMiAxOCA4MzJjMC0xMTIuMTMgMzEuNS0yMjUgNDctMzYzUy01Ljg0IDIxOCA4OSAxMDRzMzEwLjEzIDExLjM4IDQ0NyA1YzEzNi44OC02LjM4IDI1OC4yNS04NyA0MTAtODdzMjkyLjM3IDU5IDM4OCA1OWMxNzYuNzYgMCAzOTguMTItODYgNTExLTI2WiIgc3Ryb2tlPSIjMTYxNjFCIiBzdHJva2Utd2lkdGg9IjIwIi8+CiAgPGRlZnM+CiAgICA8ZmlsdGVyIGlkPSJhIiB4PSI4IiB5PSIxMiIgd2lkdGg9IjE5MDQuNTkiIGhlaWdodD0iMTUxMCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgogICAgICA8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgogICAgICA8ZmVPZmZzZXQvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1MCIvPgogICAgICA8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJhcml0aG1ldGljIiBrMj0iLTEiIGszPSIxIi8+CiAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMSAwIi8+CiAgICAgIDxmZUJsZW5kIGluMj0ic2hhcGUiIHJlc3VsdD0iZWZmZWN0MV9pbm5lclNoYWRvd184ODZfNTc1OTciLz4KICAgICAgPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgogICAgICA8ZmVPZmZzZXQvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMjUiLz4KICAgICAgPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIvPgogICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEgMCIvPgogICAgICA8ZmVCbGVuZCBpbjI9ImVmZmVjdDFfaW5uZXJTaGFkb3dfODg2XzU3NTk3IiByZXN1bHQ9ImVmZmVjdDJfaW5uZXJTaGFkb3dfODg2XzU3NTk3Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+Cjwvc3ZnPgo=';
	const outlineLight =
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxNTM2IiB2aWV3Qm94PSIwIDAgMTkyMCAxNTM2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGZpbHRlcj0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNMTg0NSA1NWMxMTIuODcgNjAgMjYuNSAyMTEuNSAxOCAzMTJzMzggMTU5IDM4IDI4OC02MCAyMTIuNS02MCAzMzcgNDUuMjUgMzE3LjI1LTU2IDM5NC0zNDUtMTYuNS00NzMgMC0yNTYgMTI2LTM2OSAxMjYtMjgwLjc1LTExMy00NDUtMTEzYy0xMzEuNjMgMC0zMTkuNjMgNzMuNjMtMzk1IDIwLTc1LjM4LTUzLjYzLTMxLjUtMTc4LTQ1LTI5NVMxOCA5NDQuMTIgMTggODMyYzAtMTEyLjEzIDMxLjUtMjI1IDQ3LTM2M1MtNS44NCAyMTggODkgMTA0czMxMC4xMyAxMS4zOCA0NDcgNWMxMzYuODgtNi4zOCAyNTguMjUtODcgNDEwLTg3czI5Mi4zNyA1OSAzODggNTljMTc2Ljc2IDAgMzk4LjEyLTg2IDUxMS0yNloiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAxIi8+CiAgPC9nPgogIDxwYXRoIGQ9Ik0xODQ1IDU1YzExMi44NyA2MCAyNi41IDIxMS41IDE4IDMxMnMzOCAxNTkgMzggMjg4LTYwIDIxMi41LTYwIDMzNyA0NS4yNSAzMTcuMjUtNTYgMzk0LTM0NS0xNi41LTQ3MyAwLTI1NiAxMjYtMzY5IDEyNi0yODAuNzUtMTEzLTQ0NS0xMTNjLTEzMS42MyAwLTMxOS42MyA3My42My0zOTUgMjAtNzUuMzgtNTMuNjMtMzEuNS0xNzgtNDUtMjk1UzE4IDk0NC4xMiAxOCA4MzJjMC0xMTIuMTMgMzEuNS0yMjUgNDctMzYzUy01Ljg0IDIxOCA4OSAxMDRzMzEwLjEzIDExLjM4IDQ0NyA1YzEzNi44OC02LjM4IDI1OC4yNS04NyA0MTAtODdzMjkyLjM3IDU5IDM4OCA1OWMxNzYuNzYgMCAzOTguMTItODYgNTExLTI2WiIgc3Ryb2tlPSIjRjBFRUZGIiBzdHJva2Utd2lkdGg9IjIwIi8+CiAgPGRlZnM+CiAgICA8ZmlsdGVyIGlkPSJhIiB4PSI4IiB5PSIxMiIgd2lkdGg9IjE5MDQuNTkiIGhlaWdodD0iMTUxMCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgogICAgICA8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgogICAgICA8ZmVCbGVuZCBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0ic2hhcGUiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgogICAgICA8ZmVPZmZzZXQvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI1MCIvPgogICAgICA8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJhcml0aG1ldGljIiBrMj0iLTEiIGszPSIxIi8+CiAgICAgIDxmZUNvbG9yTWF0cml4IHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMSAwIi8+CiAgICAgIDxmZUJsZW5kIGluMj0ic2hhcGUiIHJlc3VsdD0iZWZmZWN0MV9pbm5lclNoYWRvd184ODZfNTc1OTciLz4KICAgICAgPGZlQ29sb3JNYXRyaXggaW49IlNvdXJjZUFscGhhIiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgogICAgICA8ZmVPZmZzZXQvPgogICAgICA8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxMjUiLz4KICAgICAgPGZlQ29tcG9zaXRlIGluMj0iaGFyZEFscGhhIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgazI9Ii0xIiBrMz0iMSIvPgogICAgICA8ZmVDb2xvck1hdHJpeCB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEgMCIvPgogICAgICA8ZmVCbGVuZCBpbjI9ImVmZmVjdDFfaW5uZXJTaGFkb3dfODg2XzU3NTk3IiByZXN1bHQ9ImVmZmVjdDJfaW5uZXJTaGFkb3dfODg2XzU3NTk3Ii8+CiAgICA8L2ZpbHRlcj4KICA8L2RlZnM+Cjwvc3ZnPgo=';
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
              -webkit-mask-image: url('{mask}');
              mask-image: url('{mask}');
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
						srcPlaceholder={placeholder}
						alt="Cat"
						width="1920"
						height="1536"
						classOutline="w-full h-full absolute right-0 top-0"
						srcOutline={$themeApp === 'light' ? outlineLight : outlineDark}
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
					href={$sessionStore?.user.id && $userSummary
						? `/generate?p=${encodeURIComponent(
								$LL.Landing.Describe.Prompt()
						  )}&mi=22b0857d-7edc-4d00-9cd9-45aa509db093`
						: `/generate?p=${encodeURIComponent(
								$LL.Landing.Describe.Prompt()
						  )}&smo=true&mi=22b0857d-7edc-4d00-9cd9-45aa509db093`}
					class="mt-6 w-full hidden md:block max-w-[15rem] px-6 md:px-8 py-4"
					noPadding
				>
					{$LL.Landing.TryItNowButton()}
				</Button>
			</div>
		</div>
	</div>
</section>
