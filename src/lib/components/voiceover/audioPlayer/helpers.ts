import { allAudioPlayers } from '$ts/stores/allPlayers';
import { area, scaleLinear, timer, select, curveBasis, max, type Selection, type Timer } from 'd3';
import { get } from 'svelte/store';

export async function getAudioBufferFromUrl(url: string) {
	const res = await fetch(url);
	const buf = await res.arrayBuffer();
	const audioContext = new AudioContext();
	const audioBuf = await audioContext.decodeAudioData(buf);
	return audioBuf;
}

export async function audioBufferToArray(buf: AudioBuffer, samples: number = 100) {
	const filteredData = getFilteredData(buf, samples);
	const normalizedData = normalizeData(filteredData);
	return normalizedData;
}

export async function audioToArray(url: string, samples: number = 100) {
	const audioBuf = await getAudioBufferFromUrl(url);
	const filteredData = getFilteredData(audioBuf, samples);
	const normalizedData = normalizeData(filteredData);
	return normalizedData;
}

function getFilteredData(audioBuffer: AudioBuffer, samples: number) {
	const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
	const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
	const filteredData = [];
	for (let i = 0; i < samples; i++) {
		let blockStart = blockSize * i; // the location of the first sample in the block
		let sum = 0;
		for (let j = 0; j < blockSize; j++) {
			sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
		}
		filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
	}
	return filteredData;
}

function normalizeData(data: number[]) {
	const multiplier = Math.pow(Math.max(...data), -1);
	return data.map((n) => n * multiplier);
}

export function convertSecondsToTimestamp(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.round(seconds % 60);

	const formattedMinutes = String(hours > 0 ? hours * 60 + minutes : minutes).padStart(2, '0');
	const formattedSeconds = String(remainingSeconds).padStart(2, '0');

	return hours > 0
		? `${String(hours).padStart(2, '0')}:${formattedMinutes}:${formattedSeconds}`
		: `${formattedMinutes}:${formattedSeconds}`;
}

export function stopAllPlayers(exceptionElement?: HTMLAudioElement) {
	const allPlayers = get(allAudioPlayers);
	allPlayers.forEach((player) => {
		if (exceptionElement && player === exceptionElement) return;
		player.pause();
	});
}
export async function togglePlay({
	audioElement,
	state,
	callback
}: {
	audioElement: HTMLAudioElement;
	state?: 'play' | 'pause';
	callback?: () => void;
}) {
	if (state === 'play') {
		stopAllPlayers(audioElement);
		try {
			await audioElement.play();
		} catch (error) {}
	} else if (state === 'pause') {
		audioElement.pause();
	} else if (audioElement.paused) {
		stopAllPlayers(audioElement);
		try {
			await audioElement.play();
		} catch (error) {}
	} else {
		audioElement.pause();
	}
	if (callback) callback();
}

export function toggleMute(audioElement: HTMLAudioElement) {
	if (audioElement.muted) {
		audioElement.muted = false;
	} else {
		audioElement.muted = true;
	}
}

export function areValuesCloseEnough(a: number, b: number) {
	return Math.abs(a - b) < 0.01;
}

export function drawWaveform(options: DrawWaveformOptions): void {
	const { values, progress, element, margin, width, height, gradientStops1, gradientStops2 } =
		options;

	// Remove previous chart if it exists
	select(element).selectAll('*').remove();

	const svg = select(element)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Define gradients
	const createGradient = (id: string, stops: GradientStop[]) => {
		const gradient = svg
			.append('defs')
			.append('linearGradient')
			.attr('id', id)
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '0%')
			.attr('y2', '100%');

		stops.forEach((stop) => {
			gradient.append('stop').attr('offset', stop.offset).attr('stop-color', stop.color);
		});

		return gradient;
	};

	createGradient('gradient1', gradientStops1);
	createGradient('gradient2', gradientStops2);

	// Set the ranges
	const x = scaleLinear().range([0, width]);
	const y = scaleLinear().range([height, 0]);

	// Define the area
	const svgArea = area<number>()
		.x((d, i) => x(i / (values.length - 1))) // Adjust here
		.y0(height)
		.y1((d) => y(d))
		.curve(curveBasis);

	// Scale the range of the data
	x.domain([0, 1]);
	y.domain([0, max(values) as number]);

	// Define clipping paths
	svg
		.append('clipPath')
		.attr('id', 'clip-completed')
		.append('rect')
		.attr('width', x(progress))
		.attr('height', height);

	svg
		.append('clipPath')
		.attr('id', 'clip-remaining')
		.append('rect')
		.attr('x', x(progress))
		.attr('width', x(1 - progress))
		.attr('height', height);

	// Add the completed path with the first gradient
	svg
		.append('path')
		.datum(values)
		.attr('clip-path', 'url(#clip-completed)')
		.attr('fill', 'url(#gradient1)')
		.attr('d', svgArea);

	// Add the remaining path with the second gradient
	svg
		.append('path')
		.datum(values)
		.attr('clip-path', 'url(#clip-remaining)')
		.attr('fill', 'url(#gradient2)')
		.attr('d', svgArea);
}

let animateTimer: CustomTimer | undefined;

export function resetWave(element: HTMLElement) {
	select(element).selectAll('*').remove();
	if (animateTimer) {
		animateTimer.stop();
		animateTimer = undefined;
	}
}

interface DrawWaveformOptions {
	values: number[];
	progress: number;
	element: HTMLDivElement;
	margin: Margin;
	width: number;
	height: number;
	gradientStops1: GradientStop[];
	gradientStops2: GradientStop[];
}

interface Margin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}
interface GradientStop {
	offset: string;
	color: string;
}

interface WaveOptions {
	element: HTMLDivElement;
	width: number;
	height: number;
	margin: Margin;
	initialWavelength: number;
	speed: number;
	modulationFrequency: number; // Frequency of amplitude modulation
	gradientStops: GradientStop[];
	minAmplitude: number; // Minimum amplitude, between 0 and 1
	maxAmplitude: number; // Maximum amplitude, between 0 and 1
	shouldAnimate: boolean;
	minY: number;
	maxY: number;
}

interface DataPoint {
	x: number;
	y: number;
}

export function animateWave(options: WaveOptions): void {
	const {
		element,
		width,
		height,
		margin,
		initialWavelength,
		speed,
		modulationFrequency,
		gradientStops,
		minAmplitude,
		maxAmplitude,
		shouldAnimate,
		minY,
		maxY
	} = options;

	// Check if SVG exists
	let svgSelection = select(element).select<SVGSVGElement>('svg');

	let svgEl: Selection<SVGGElement, unknown, null, undefined>;
	let path: Selection<SVGPathElement, unknown, null, undefined>;

	if (svgSelection.empty()) {
		svgEl = select(element)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left}, ${margin.top})`);

		const gradient = svgEl
			.append('defs')
			.append('linearGradient')
			.attr('id', 'gradient')
			.attr('x1', '0%')
			.attr('y1', '0%')
			.attr('x2', '0%')
			.attr('y2', '100%');

		gradientStops.forEach((stop) => {
			gradient.append('stop').attr('offset', stop.offset).attr('stop-color', stop.color);
		});

		path = svgEl.append('path').attr('fill', 'url(#gradient)');
	} else {
		svgEl = svgSelection.select<SVGGElement>('g');
		path = svgEl.select('path');
	}

	const x = scaleLinear().domain([0, width]).range([0, width]);
	const y = scaleLinear()
		.domain([-1, 1])
		.range([height * (1 - maxY), height * (1 - minY)]);

	let wavelength = initialWavelength;
	let phase = 0;

	const waveArea = area<DataPoint>()
		.x((d) => x(d.x))
		.y0(height)
		.y1((d) => y(d.y))
		.curve(curveBasis);

	function generateWave(): DataPoint[] {
		let data: DataPoint[] = Array.from({ length: width }, (_, i) => {
			let amplitude =
				minAmplitude +
				((Math.sin(i / modulationFrequency) + 1) / 2) * (maxAmplitude - minAmplitude);
			return {
				x: i,
				y: amplitude * Math.sin((i + phase) / wavelength)
			};
		});
		return data;
	}

	function animate(): void {
		phase += speed;
		const data = generateWave();
		path.datum(data).attr('d', waveArea);
	}

	if (shouldAnimate) {
		if (!animateTimer) {
			animateTimer = new CustomTimer(animate);
		}
		animateTimer.start();
	} else {
		if (animateTimer) {
			animateTimer.stop();
		} else {
			const data = generateWave();
			path.datum(data).attr('d', waveArea);
		}
	}
}

class CustomTimer {
	private customTimer?: Timer;
	private elapsedTime: number;
	private callback: (elapsed: number) => void;

	constructor(callback: (elapsed: number) => void) {
		this.elapsedTime = 0;
		this.callback = callback;
	}

	start() {
		if (this.customTimer) {
			// Timer exists, so resume it.
			this.customTimer.restart(this.tick.bind(this), this.elapsedTime);
		} else {
			// Timer does not exist, so start a new one.
			this.customTimer = timer(this.tick.bind(this));
		}
	}

	stop() {
		if (this.customTimer) {
			// Stop the timer, but don't reset it.
			this.customTimer.stop();
		}
	}

	private tick(elapsed: number) {
		this.elapsedTime = elapsed;
		this.callback(this.elapsedTime);
	}
}
