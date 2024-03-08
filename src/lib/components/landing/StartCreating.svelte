<script lang="ts">
	import LazyImage from '$components/utils/LazyImage.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import LL from '$i18n/i18n-svelte';
	import { themeApp } from '$ts/stores/theme';
	import { userSummary } from '$ts/stores/user/summary';
	import { sessionStore } from '$ts/constants/supabase';
</script>

<section id="start-creating" class="flex w-full justify-center pb-8 pt-16 md:pb-16 lg:pt-8 xl:pt-4">
	<div class="flex w-full max-w-7xl flex-col items-center px-3 md:px-8">
		<div class="flex flex-col items-center px-3 md:px-6">
			<h2
				class="max-w-[19rem] flex-1 text-center text-3xl font-semibold leading-tight md:max-w-[22rem]
        md:text-4xl lg:max-w-[36rem] lg:text-5xl lg:leading-tight"
			>
				{$LL.Landing.StartCreating.Title()}
			</h2>
			<p
				class="mt-2 max-w-[22rem] text-center leading-relaxed text-c-on-bg/75 md:text-lg lg:max-w-[36rem] lg:text-xl"
			>
				{$LL.Landing.StartCreating.Paragraph()}
			</p>
			<Button
				href={$sessionStore?.user.id && $userSummary ? '/generate' : '/generate?smo=true'}
				class="mt-6 w-full max-w-[16rem] px-6 py-4 md:px-8"
				noPadding
			>
				{$LL.Landing.StartCreatingButton()}
			</Button>
		</div>
		<div
			class="relative z-0 mt-8 w-full overflow-hidden rounded-lg
			shadow-2xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary md:mt-10 md:rounded-xl lg:rounded-2xl"
		>
			<LazyImage
				class="h-auto w-full scale-100.2 transform"
				src={$themeApp === 'light' ? '/landing/app-light-1920.webp' : '/landing/app-dark-1920.webp'}
				srcset="
        {$themeApp === 'light'
					? `/landing/app/app-light-512.webp 512w,
          /landing/app/app-light-768.webp 768w,
          /landing/app/app-light-1024.webp 1024w,
          /landing/app/app-light-1440.webp 1440w,
          /landing/app/app-light-1920.webp 1920w`
					: `/landing/app/app-dark-512.webp 512w,
          /landing/app/app-dark-768.webp 768w,
          /landing/app/app-dark-1024.webp 1024w,
          /landing/app/app-dark-1440.webp 1440w,
          /landing/app/app-dark-1920.webp 1920w`}
      "
				sizes="(min-width: 1280px) 1280px, 100vw"
				width="1920"
				height="1200"
				alt="App"
				placeholder={$themeApp === 'light'
					? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAYAAAD+pA/bAAAClUlEQVR4AaWSM6BtRxSGvzUzx9e2Ytt2ynSp0ndhnzZtulSxVcU2n22bx9ict+88W982ZuH/l2xaXd42OtHeHjWEVgTNZh3Pq6OUcofv+xhjCMMQEQHAWovWmiiKSKUMogQR0NqwZ/de6vUa2VyWcqVSlQ9enWN///crhm7yuGKygysufYSZieuTnxpYGwO4YMdiLS6gSbnAfPDKdtYt8njm5QEGLw+pFy25fM4Vpwebd7z0zlc/ZDIjc5m/dzcDEzdxy+jl1L0mIgqtFScigsMixDHkO4SJq9P0TejkOUCJIZPJzHZeNb2Ppbh96Fqm8tfyxpbV3FtqoJRNWk9hTJo4jo6p3AIgRzO4Im54IPnP+uzd2aBajunuzrl/4zhGXX1Zi5syHeycex8P7V/EFfUlhGl1bMDTI7ijVgwp7gogFiCm5bUOfQRz5e4YnRGyTw+x+88Q/IAotpwviV+um0KhzZmfdO46NVvNFL9s3s6eaAk33fscA5fdgV/3OX8EsCilXOfJ1LnpUz2XjTAw3cbA/7/R8jS+SaGV5gJwgT3Pc9onHroO1MbiFnaU/kH4ku/m7qJaHSBlPPfz+RyHcCMtgkOJwgTzFrNo/iqqV11HFF5FLugD8RExh6ZFTjGmcuz9cc/xrBdAs9UkNSvRg7ffyFMP3kW+Z4B75r+GWfQJQXvnhcjj9DfaOLOdzCKYxcpjpxEK60r03eijJyy2qbg4LOl0xkmkli1dyruffM6qVavpurqP7Fgv1uOCyWSy5PMFJ1sUR5i2XLp9ZmKUa2+6kz1btlPcVkffAeLJeXmQSORkUcrdO7OBdnPzbU9uH568sb0rp6jsaTE2PU2jWsP3PMAH7LnMvwsYRAEtv4Ugh5NXDwAA8ztGQlQi4AAAAABJRU5ErkJggg=='
					: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAYAAAD+pA/bAAACo0lEQVR4AZyTNYArNxRFjzTgsdcUL+9nZuZf5XdhThts0xfpi3DK9G2YmZmZeZnZ7JGUSImXg9cekvTuu4/Els17B8enezOiFlKsK5KRTyoVEscKz/PI5wtUKmUajTpNCCFQyu3/vt7AGI3BoGJFW1sH6UyGcqmE53vz4tjma42Sc+jOXzj/1C4+/XSczz7uJ5ONaMKSGWMQYsGF+1a6jlIxN194L/s2b+GeB25lcOpL0qkCxeI8QgrEAf/6ubbdWzJtZ59h/ZHTvPvKr3zy4PPk2tuR0ildUL0S2mjAsLXrMC2JiB+Hv0ZRwS6Xy2WEkPN+48Akwb4NlPvWc9/Yr4ihAZLSERIEIZ6nacKqXu5MuDR91fsGxdl5Wts6yWcLTE1P2jPukju3FjnZch71n6/k0toP7K18TclLu81/hnH5z6RayeXaEFhlEEXRghh5qprmVGjwjhXpzsUkDCgk/xVWkCUtlYpIKfF93wmQP8RdvDYQMzs1woazt5DffA5dn/q/DmzNFjoMBDK/pYO2TUl6PnkfrZOoRAQm5r/CklvlNj32GcexW/P754dpFH9gZuZpHnvjMGq2Dd95N+7AYmEdzRLCBeJl63YuLLTW7vLNZ1/zU8rjkyO72BmdJDvzCRADYqETVsOuL6YGxIKYPzrPI4pSbkD9s4f2ErSn+er7Tznw2u38NDuCyeT5j7BpsQ4WUmMvF8FHqkhn7JP4eYr2Iy30/iLQPwlI8r8KbUktarWqe5d9vb08/eLrDA+PsPvcfgo7N6ArVf4PrGpLXC6X7LtLlZ9JhZlk1EpHdw+ffTDKwPfjyDD4M/8SIcyaShff5dJvS2rJm22bEYW29YNhIswU0gHTo2W0ial6ikB61njNzlled0vkOobfBjIYDXwGAN0tUNLsv4fMAAAAAElFTkSuQmCC'}
			/>
		</div>
	</div>
</section>
