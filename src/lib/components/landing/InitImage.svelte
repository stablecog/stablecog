<script lang="ts">
	import LazyImageWithOutline from '$components/utils/LazyImageWithOutline.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';
</script>

<section
	id="init-image"
	class="relative z-0 flex w-full flex-col justify-center overflow-hidden pb-4 pt-20 lg:flex-row"
>
	<div class="flex flex-col items-center px-5 lg:hidden">
		<h2
			class="flex-1 text-center text-3xl
				font-semibold leading-tight md:text-4xl lg:text-5xl lg:leading-tight"
		>
			{$LL.Landing.InitImage.Title()}
		</h2>
		<p
			class="mt-2 max-w-[24rem] text-center leading-relaxed text-c-on-bg/75 md:max-w-[26rem] md:text-lg lg:max-w-[35rem] lg:text-xl"
		>
			{$LL.Landing.InitImage.Paragraph()}
		</p>
		<Button
			href={$sessionStore?.user.id && $userSummary ? '/generate' : '/generate?smo=true'}
			class="mt-6 w-full max-w-[15rem] px-6 py-4 md:px-8"
			noPadding
		>
			{$LL.Landing.TryItNowButton()}
		</Button>
	</div>
	<div
		class="relative mt-8 flex w-full max-w-[120rem] items-center justify-center gap-4 md:gap-8 lg:h-[calc(100svh-env(safe-area-inset-bottom)-10rem)]
    lg:min-h-[40rem] lg:gap-0"
	>
		<div class="relative -ml-[15%] aspect-[2/3] h-full flex-1 lg:ml-0 lg:flex-none">
			<LazyImageWithOutline
				style="
					-webkit-mask-image: url(/landing/dragon/dragon-mask.svg);
					mask-image: url(/landing/dragon/dragon-mask.svg);
					-webkit-mask-repeat: no-repeat;
					mask-repeat: no-repeat;
					mask-size: cover;
					-webkit-mask-size: cover;
					mask-position: right center;
					-webkit-mask-position: right center;
				"
				class="absolute right-0 top-0 h-full w-full"
				src="/landing/dragon/dragon-1920.webp"
				srcset="
          /landing/dragon/dragon-512.webp 512w,
          /landing/dragon/dragon-768.webp 768w,
          /landing/dragon/dragon-1024.webp 1024w,
          /landing/dragon/dragon-1440.webp 1440w,
          /landing/dragon/dragon-1920.webp 1920w,
        "
				sizes="(min-width: 1024px) 40vw, 50vw"
				alt="Dragon"
				width="1280"
				height="1920"
				placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAIAAAB8wupbAAADnUlEQVR4ARXP1WLrRhAG4JnZXVmSITGHc6jMzMzM+Ih9hzL3ptxgG2ajbNFidf67hYEPLzVecc4CoEBBzDgHCMyBKW5cEUDjrHLWWq1sYiDnggix+AFoObMVwNRZx6miMbZgEYk5AmdyZ+B6it/A0BEBOsykSZlf9XyfpCjbduCF5BABnDOIROQhILHrBUBWBDjTYfPZRE5JgRDMr9Rmmxy5sUYQL5HgVAJATgi+V23TjTujbQmR57zDwabzs3GCViWd0rxTUAgUaIVI6PG63/X17GH/cKjOQRgS0pN+nA0FlNH6hLMNG+Sin5m00Gsq8ZZYqgStOM+0XBjhnstEw1tRpOvldJglJvOWajf1aSeic3AggLOr/tO3Xrnr/Q/e8kP+y9r3ndJSDCPiyGzAbLk7s7pSuVKCkoSUFR7QtNhZqc6EwI2QYeDm51dbptQ7Sv5IUMUutV60PVk/6B0X9OIPJ07LS4vluh8n6cbOVhuueHnj6tIdnqk+1Hz29Vs/HUXRV+efJbPDW2uPUR4ap/jmxk7nPL81uDLORhLGo0Pi18RDNz6nena5dnPr8nLncPHBhadcxnKVS8rYldojTa+7vrl1uH+a8EFiIjatlefNKOpNp/Lmzm2X/dsHvf5vgy8iOiEktli5p8brm4ebng2bpU7f7V/YAyTIbDocx+2wnejpWb5neVp81k7SbPEp7vWTM9/zDTPSSxmjLDZe4NlMb52vG+1iHUkq7hHAUQGfxGnDn1sIr8Y2aurLj8D7RqtURVCR6AMxB0zHZprZqTaKNf2b/x2vt4J5poLcxAPcD6niB6ULuy9MkEZqQoOOtzg1FxMzkFqR0ppr7yBZW8u/cwqAmU36iZKgJhrg5xzYsrhRQqZQOQeESLnNG3xhwd58SusnuFmV8xPX27O/e3ntUG7o6rQCtaNoCwl8EXLi5Je4R14IDUf5Kf8783p13uzjwdCecof70Vq5PHPvyqPDwVi7DBGJAc9drtjUgragpJgQiLq6Sipo8ZWe3j9VO4/e8tTzd7yCadmCYyvlR9JYR3jap50q6waskuW2I6+GbiYT05guWBquBjcWHpWbHGK2WnswTnIDKuUj31U1aGVVwy5yED3aByZjjMqukU3zSotFWUQytSN2VMKwgk0N0ilyqMfsdMKGuR1bp0/S3f/itRtvXB5OhtNJysdZZEUaqxHYApkzIossYmeeLQMiOk7AL/QJle3lK/OW9P9R0CGEeobYrgAAAABJRU5ErkJggg=="
				classOutline="w-full h-full absolute right-0 top-0"
				srcOutline={$themeApp === 'light'
					? '/landing/dragon/dragon-outline-light.svg'
					: '/landing/dragon/dragon-outline-dark.svg'}
				altOutline="Dragon Outline"
			/>
		</div>
		<div
			class="absolute bottom-[20%] z-10 flex flex-col items-center px-6 pb-8 pt-6 lg:relative lg:bottom-0 lg:min-w-[35%] lg:pb-20 lg:pt-12 xl:min-w-[44%]"
		>
			<div class="hidden flex-col items-center lg:flex">
				<h2
					class="max-w-[19rem] flex-1 text-center text-3xl font-semibold leading-tight
						md:max-w-[22rem] md:text-4xl lg:max-w-[36rem] lg:text-5xl lg:leading-tight"
				>
					{$LL.Landing.InitImage.Title()}
				</h2>
				<p
					class="mt-2 max-w-[22rem] text-center leading-relaxed text-c-on-bg/75 md:text-lg lg:max-w-[36rem] lg:text-xl"
				>
					{$LL.Landing.InitImage.Paragraph()}
				</p>
				<Button
					href={$sessionStore?.user.id && $userSummary ? '/generate' : '/generate?smo=true'}
					class="mt-6 w-full max-w-[15rem] px-6 py-4 md:px-8"
					noPadding
				>
					{$LL.Landing.TryItNowButton()}
				</Button>
			</div>
			<div class="relative flex w-full items-center justify-center lg:mt-20">
				<div
					style="background-image: url({$themeApp === 'light'
						? '/landing/arrow/arrow-middle-light.png'
						: '/landing/arrow/arrow-middle-dark.png'}); background-size: auto 100%; background-repeat: repeat-x;"
					class="absolute left-1/2 top-1/2 h-4 w-[calc(100%+20rem)] max-w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 transform lg:w-[calc(100%+12rem)]"
				>
					<img
						class="absolute -left-4 top-0 h-full"
						alt="Arrow Start"
						src={$themeApp === 'light'
							? '/landing/arrow/arrow-start-light.png'
							: '/landing/arrow/arrow-start-dark.png'}
					/>
					<img
						class="absolute -bottom-5 -right-9 h-14 w-14"
						alt="Arrow End"
						src={$themeApp === 'light'
							? '/landing/arrow/arrow-end-light.png'
							: '/landing/arrow/arrow-end-dark.png'}
					/>
				</div>
				<p
					class="relative rounded-xl bg-c-bg-secondary px-4 py-2 text-lg font-medium shadow-xl
						shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-tertiary md:px-6 md:py-3 md:text-2xl lg:text-3xl"
				>
					{$LL.Landing.InitImage.Prompt()}
				</p>
			</div>
		</div>
		<div class="relative -mr-[15%] aspect-[2/3] h-full flex-1 lg:mr-0 lg:flex-none">
			<LazyImageWithOutline
				style="
					-webkit-mask-image: url(/landing/dragon-alien/dragon-alien-mask.svg);
					mask-image: url(/landing/dragon-alien/dragon-alien-mask.svg);
					-webkit-mask-repeat: no-repeat;
					mask-repeat: no-repeat;
					mask-size: cover;
					-webkit-mask-size: cover;
					mask-position: right center;
					-webkit-mask-position: right center;
				"
				class="absolute right-0 top-0 h-full w-full"
				src="/landing/dragon-alien/dragon-alien-1920.webp"
				srcset="
          /landing/dragon-alien/dragon-alien-512.webp 512w,
          /landing/dragon-alien/dragon-alien-768.webp 768w,
          /landing/dragon-alien/dragon-alien-1024.webp 1024w,
          /landing/dragon-alien/dragon-alien-1440.webp 1440w,
          /landing/dragon-alien/dragon-alien-1920.webp 1920w,
        "
				sizes="(min-width: 1024px) 40vw, 50vw"
				alt="Dragon Alien"
				width="1280"
				height="1920"
				placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAIAAAB8wupbAAAEE0lEQVR4AQ3Pg5vsyB4A0F9KySSdZsaN4Xtr27b5Ye0Pa9u2bdu2dW2O3UY6rKq95z84SifZloKqAJIobPj1EPiAtVXC6HBD1yBmIyyP15dwybFCHMdVBCIYMFYYQy1lL98ey+yw8cH1enO0vCgb2cqI6AvWflSoD4GCu/VNdRx3ha30kX0wUl2/6YK3WWZbpMKKofkdkQFBndnG+qpXjNB4CzKZjCIFubKhDNJDvMDtjPfssNm+juPUGlXJwtHS4uWF73iAtmk7JIHaKo1K0Z8BEAI4CYOgM5U9+YjLutp71g8vL1fz+fLIu0s/3iy1h4pNMxLXkAZ2SIF44FFFw/0tu1BMa/Xi0PDqL+a9+P2yV9toru7awld8L7CDmpVqU4kmQ6EIQAgTnZgi4FNjI5oeCXzOkPnJyMvtkG6Sgs1rht/OdDUZjfuBixEJRUgEF4ZhZvrT/Vtt3LWm/5cfvunv3CpE9tLJ32LE8kRTKrytq7NSrQgA5AYISTCienawb92S9SsXLdl0y43vfuLBnbfaX4M2BAwDjE2vVVQl1W4xSiUIhBGNRM2u/3fOVcZTGeOy265etPTfz396K0biUZqMQZtd9ABx04xStiGLCRfhhlxHT8fF916sUX16fOr6W85rhf4OM90IikRXm25zeGgEc0YY0iMGopgxygIvCL0gYUZeevmxarh2896dW4hZ9fOEUjewf/n1p/Gx8U5rk1S0mwgpheRu047oxh/fz/vsl+db1Y0xojP2MFIQ5XqX2dttDYTMW5ufX6xMkpD7QgrEoLZevv/K2wD2QNu2GOO6X0BYUaWxSfeOw+78fyc+qNqTGW0HBFJBBFRIlMedeWu+BQBDjTaDWtbaxFJ7Blq3GG4sdrzmzrkTGOrsTgwgkEBbmFv0V69akoehZEs/FWa+MuXKRi6+sU0LS2d/NKS1amhxRKRSZichFKtYW/jX/J9//5YpWpvey2Sk5q9SJDBV/Xb0qUbQWF74CSTdafMDs20DaEO6XrGNpO6xSgJ1W0ZmtLa84s+04dzq8l9ld4gqzOE1H+qu73AZIgGQ27Tv+KsOPeXisyhPWCxtRWM8DBpBNe9OMqU9lB4oCpcyN5DVNBXFLWunY7Zv/T8kEqkGNNYU/pUQIM5K/mSdz4XSaY2mo3oSFACHOo5NttlzWxKTKkAzbNQhP1WtuTZHSFb5dCAcAbVjjz9LCv74yzequh7TTLTFPpuqOivXYHrFLIdZAX5KTUtF2KIUgtCwte+xB+lGPCV7R/MrJeUEYWmS1FOXvv3iK09HkQVYqlSNiY5qOBPCzIknXLvpjn0XHHEmkcY/f//RLDWJl2/+uujnv96bRyl3ubNZfF+VtzCkcQgUQFOTw+899BlIxFSe4H1RtfM/4e8VW66QpJgAAAAASUVORK5CYII="
				classOutline="w-full h-full absolute right-0 top-0"
				srcOutline={$themeApp === 'light'
					? '/landing/dragon-alien/dragon-alien-outline-light.svg'
					: '/landing/dragon-alien/dragon-alien-outline-dark.svg'}
				altOutline="Dragon Alien Outline"
			/>
		</div>
	</div>
</section>
