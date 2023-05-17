<script lang="ts">
	import { page } from '$app/stores';
	import ImageWithOutlineAndPlaceholder from '$components/ImageWithOutlineAndPlaceholder.svelte';
	import Button from '$components/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';

	const placeholder =
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAACwElEQVR4AQXBQ4M8RxwA0Kr6VVtjrnq9G9t2cotxzDW3XPNlglNs2/ba9s60VV39fw/X8SVPdJ/93//7wHd1quzE2wZqabjEMFFp5Zwt7PHvRaRdYT++71HOMFWotO3uCpkFLB81L26INhA1E8Q+87KUd+WbtXwyZJtd8ypRImF4DoCxyI22PCbKahCRrjlqtuy9aGNUL8tmkytQbU9b5amIkE59jOTrNMrTkqrWxM6wJa35PWSZ2/G/i0cf2/Vnrpic2IYewxIouqwIl9Zqf0Y5pRh0anhxrkhwa/uSX/s/bm1/ryF17mSupNZuvnKGCFm5bKiWfNsVQ1/++i/lBT7PTi6vWAD0s72Xvjn+ooOunZSvTnm0fryr/KXcdov94N0NYqDFv7bCPqciqixFv5f73fMQr7LtKfSQCHI/7jfloYbVVEt6lhLChLnfz59/4bV/0QodgKtkGi/HfxA2PEvu71qDhqGFvC+KtFFqNyvK2FDzzXfWvvniAAunSXYCBtEN0tRAx0Xe54HDTutaaWpgxtQMQRYkST8+DV//5Ltj5+BE+u+EbYGIlXX2N0JIFfGQZiHOT/oxJapulfv93s7R5vf//mnkLaz0/gjfzFCGNVQnWK7KFsoFwOgy5WrKhkSlbmmDjh96zmnC93vCxilbhMIsii4oaJDiVMKGbY6kiK2Hm266a4jJDVMTMrBF989l/vlBuoC5pZGOV2zCbepzAhTrybwpaSrAWVBc3L75sqkrN3tzn+y88p//Q85BwjrGRZ9v62QaSsQcli6VsLzu/x9F8s3GI5cP3jg1bL//15u/O19SZNWgaZJqhtgYvTspXOjnTpI7OlFZTifEm2u4zpNIUIVbL72pBZNFgL3sLOFZHeyzYvmY/wNNsNMiYUwqkSlAEuZcywUeMz/gclqvZENCVmKI7+dzfnEsYe0CMh9IzfPOP54AAAAASUVORK5CYII=';
	const mask =
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxOTIwIiB2aWV3Qm94PSIwIDAgMTkyMCAxOTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGNsaXAtcGF0aD0idXJsKCNhKSI+CiAgICA8cGF0aCBkPSJNMjMyLTE4M1MzNy44IDY3LjUgMjAgMjI1QzIuMTkgMzgyLjUgOTkgNDUzIDk5IDYxM1MtLjc4IDg5Mi44OCAyNCAxMDM2czEwOC4xOSAxNTYuNSAxNjYgMjg0LTQ1LjU2IDMyMS4wNiA4MSA0MTcgMjc5IDE1LjM4IDQzOSAzNmMxNjAgMjAuNjIgMjEyLjc1IDEzMCAzNTQgMTMwczE4OC4zMS04NSA0MTMtODUgNTIxLjQ0IDIxMC42MiA2MzMtMjUwVi0xODNIMjMyWiIgZmlsbD0iIzAwMCIvPgogIDwvZz4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iYSI+CiAgICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIDBoMTkyMHYxOTIwSDB6Ii8+CiAgICA8L2NsaXBQYXRoPgogIDwvZGVmcz4KPC9zdmc+Cg==';
	const outlineDark =
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxOTIwIiB2aWV3Qm94PSIwIDAgMTkyMCAxOTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF84NjRfNTc1OTMpIj4KICAgIDxnIGZpbHRlcj0idXJsKCNhKSI+CiAgICAgIDxwYXRoIGQ9Ik0yMzItMTgzUzM3LjggNjcuNSAyMCAyMjVDMi4xOSAzODIuNSA5OSA0NTMgOTkgNjEzUy0uNzggODkyLjg4IDI0IDEwMzZzMTA4LjE5IDE1Ni41IDE2NiAyODQtNDUuNTYgMzIxLjA2IDgxIDQxNyAyNzkgMTUuMzggNDM5IDM2YzE2MCAyMC42MiAyMTIuNzUgMTMwIDM1NCAxMzBzMTg4LjMxLTg1IDQxMy04NSA1MjEuNDQgMjEwLjYyIDYzMy0yNTBWLTE4M0gyMzJaIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMSIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTIzMi0xODNTMzcuOCA2Ny41IDIwIDIyNUMyLjE5IDM4Mi41IDk5IDQ1MyA5OSA2MTNTLS43OCA4OTIuODggMjQgMTAzNnMxMDguMTkgMTU2LjUgMTY2IDI4NC00NS41NiAzMjEuMDYgODEgNDE3IDI3OSAxNS4zOCA0MzkgMzZjMTYwIDIwLjYyIDIxMi43NSAxMzAgMzU0IDEzMHMxODguMzEtODUgNDEzLTg1IDUyMS40NCAyMTAuNjIgNjMzLTI1MFYtMTgzSDIzMloiIHN0cm9rZT0iIzE2MTYxQiIgc3Ryb2tlLXdpZHRoPSIyMCIvPgogIDwvZz4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9ImEiIHg9IjcuODEiIHk9Ii0xOTMiIHdpZHRoPSIyMTEyLjE5IiBoZWlnaHQ9IjIxMDYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KICAgICAgPGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CiAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KICAgICAgPGZlT2Zmc2V0Lz4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTI1Ii8+CiAgICAgIDxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9ImFyaXRobWV0aWMiIGsyPSItMSIgazM9IjEiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxIDAiLz4KICAgICAgPGZlQmxlbmQgaW4yPSJzaGFwZSIgcmVzdWx0PSJlZmZlY3QxX2lubmVyU2hhZG93Xzg2NF81NzU5MyIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CiAgICAgIDxmZU9mZnNldC8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUwIi8+CiAgICAgIDxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9ImFyaXRobWV0aWMiIGsyPSItMSIgazM9IjEiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxIDAiLz4KICAgICAgPGZlQmxlbmQgaW4yPSJlZmZlY3QxX2lubmVyU2hhZG93Xzg2NF81NzU5MyIgcmVzdWx0PSJlZmZlY3QyX2lubmVyU2hhZG93Xzg2NF81NzU5MyIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgo8L3N2Zz4K';
	const outlineLight =
		'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxOTIwIiB2aWV3Qm94PSIwIDAgMTkyMCAxOTIwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF84NjRfNTc1OTMpIj4KICAgIDxnIGZpbHRlcj0idXJsKCNhKSI+CiAgICAgIDxwYXRoIGQ9Ik0yMzItMTgzUzM3LjggNjcuNSAyMCAyMjVDMi4xOSAzODIuNSA5OSA0NTMgOTkgNjEzUy0uNzggODkyLjg4IDI0IDEwMzZzMTA4LjE5IDE1Ni41IDE2NiAyODQtNDUuNTYgMzIxLjA2IDgxIDQxNyAyNzkgMTUuMzggNDM5IDM2YzE2MCAyMC42MiAyMTIuNzUgMTMwIDM1NCAxMzBzMTg4LjMxLTg1IDQxMy04NSA1MjEuNDQgMjEwLjYyIDYzMy0yNTBWLTE4M0gyMzJaIiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMSIvPgogICAgPC9nPgogICAgPHBhdGggZD0iTTIzMi0xODNTMzcuOCA2Ny41IDIwIDIyNUMyLjE5IDM4Mi41IDk5IDQ1MyA5OSA2MTNTLS43OCA4OTIuODggMjQgMTAzNnMxMDguMTkgMTU2LjUgMTY2IDI4NC00NS41NiAzMjEuMDYgODEgNDE3IDI3OSAxNS4zOCA0MzkgMzZjMTYwIDIwLjYyIDIxMi43NSAxMzAgMzU0IDEzMHMxODguMzEtODUgNDEzLTg1IDUyMS40NCAyMTAuNjIgNjMzLTI1MFYtMTgzSDIzMloiIHN0cm9rZT0iI0YwRUVGRiIgc3Ryb2tlLXdpZHRoPSIyMCIvPgogIDwvZz4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9ImEiIHg9IjcuODEiIHk9Ii0xOTMiIHdpZHRoPSIyMTEyLjE5IiBoZWlnaHQ9IjIxMDYiIGZpbHRlclVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgPGZlRmxvb2QgZmxvb2Qtb3BhY2l0eT0iMCIgcmVzdWx0PSJCYWNrZ3JvdW5kSW1hZ2VGaXgiLz4KICAgICAgPGZlQmxlbmQgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9InNoYXBlIi8+CiAgICAgIDxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KICAgICAgPGZlT2Zmc2V0Lz4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMTI1Ii8+CiAgICAgIDxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9ImFyaXRobWV0aWMiIGsyPSItMSIgazM9IjEiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxIDAiLz4KICAgICAgPGZlQmxlbmQgaW4yPSJzaGFwZSIgcmVzdWx0PSJlZmZlY3QxX2lubmVyU2hhZG93Xzg2NF81NzU5MyIvPgogICAgICA8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHZhbHVlcz0iMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMTI3IDAiIHJlc3VsdD0iaGFyZEFscGhhIi8+CiAgICAgIDxmZU9mZnNldC8+CiAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUwIi8+CiAgICAgIDxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9ImFyaXRobWV0aWMiIGsyPSItMSIgazM9IjEiLz4KICAgICAgPGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxIDAiLz4KICAgICAgPGZlQmxlbmQgaW4yPSJlZmZlY3QxX2lubmVyU2hhZG93Xzg2NF81NzU5MyIgcmVzdWx0PSJlZmZlY3QyX2lubmVyU2hhZG93Xzg2NF81NzU5MyIvPgogICAgPC9maWx0ZXI+CiAgPC9kZWZzPgo8L3N2Zz4K';
</script>

<section
	id="hero"
	class="w-full h-[100svh] pb-[calc(env(safe-area-inset-bottom)+2rem)] min-h-[25rem] md:min-h-[40rem] flex flex-col md:flex-row items-center justify-between"
>
	<div
		class="px-6 pt-6 pb-8 md:py-12 md:pl-[max(calc((100%-1280px)/2+4rem),4rem)]
			md:pr-6 xl:pr-16 flex flex-col items-center md:items-start order-2 md:order-1"
	>
		<h1
			class="font-semibold text-3xl md:text-4xl lg:text-5xl flex-1 leading-tight md:leading-tight lg:leading-tight
				max-w-[18rem] md:max-w-[22rem] lg:max-w-[30rem] text-center md:text-left"
		>
			{$LL.Landing.Hero.Title()}
		</h1>
		<Button
			href={$page.data.session?.user.id && $userSummary ? '/generate' : '/generate?smo=true'}
			class="mt-5 w-full max-w-[15rem] px-6 md:px-8 py-4"
			noPadding
		>
			{$LL.Landing.GetStartedButton()}
		</Button>
	</div>
	<div
		class="flex-1 min-h-0 pl-12 md:pl-0 w-full md:h-full flex flex-col justify-end items-end relative order-1 md:order-2"
	>
		<div class="flex-1 flex-col w-full md:h-full overflow-hidden relative">
			<ImageWithOutlineAndPlaceholder
				style="
					-webkit-mask-image: url('{mask}');
					mask-image: url('{mask}');
					-webkit-mask-repeat: no-repeat;
					mask-repeat: no-repeat;
					mask-size: cover;
					-webkit-mask-size: cover;
					mask-position: left bottom;
					-webkit-mask-position: left bottom;
				"
				class="w-full h-full object-cover object-[25%_100%] md:object-[40%_100%] lg:object-left-bottom"
				srcset="
					/landing/hero/hero-v2-512.webp 512w,
					/landing/hero/hero-v2-768.webp 768w,
					/landing/hero/hero-v2-1024.webp 1024w,
					/landing/hero/hero-v2-1440.webp 1440w,
					/landing/hero/hero-v2-1920.webp 1920w,
				"
				sizes="(min-width: 768px) 50vw, 100vw"
				src="/landing/hero/hero-v2-1920.webp"
				srcPlaceholder={placeholder}
				alt="Hero"
				width="1920"
				height="1920"
				classOutline="w-full h-full absolute right-0 top-0 object-cover object-left-bottom"
				srcOutline={$themeApp === 'light' ? outlineLight : outlineDark}
				altOutline="Hero Outline"
			/>
		</div>
	</div>
</section>
