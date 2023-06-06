import { allAudioPlayers } from '$ts/stores/allPlayers';
import * as d3 from 'd3';
import { get } from 'svelte/store';

export async function audioToArray(url: string, samples: number = 100) {
	const res = await fetch(url);
	const buf = await res.arrayBuffer();
	const audioContext = new AudioContext();
	const audioBuf = await audioContext.decodeAudioData(buf);
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
export function togglePlay(playerElement: HTMLAudioElement) {
	stopAllPlayers(playerElement);
	if (playerElement.paused) {
		playerElement.play();
	} else {
		playerElement.pause();
	}
}

export function toggleMute(playerElement: HTMLAudioElement) {
	if (playerElement.muted) {
		playerElement.muted = false;
	} else {
		playerElement.muted = true;
	}
}

export function areValuesCloseEnough(a: number, b: number) {
	return Math.abs(a - b) < 0.1;
}

export function drawCurve({
	values,
	element,
	margin,
	width,
	height,
	gradientStops
}: {
	values: number[];
	element: HTMLDivElement;
	margin: Margin;
	width: number;
	height: number;
	gradientStops: GradientStop[];
}): void {
	const svg = d3
		.select(element)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Define gradient
	const gradient = svg
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

	// Set the ranges
	const x = d3.scaleLinear().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	// Define the area
	const area = d3
		.area<number>()
		.x((d, i) => x(i))
		.y0(height)
		.y1((d) => y(d))
		.curve(d3.curveBasis); // Using curveBasis for smoother curve

	// Scale the range of the data
	x.domain(d3.extent(values, (d, i) => i) as [number, number]);
	y.domain([0, d3.max(values, (d) => d) as number]);

	// Add the area path.
	svg
		.append('path')
		.data([values])
		.attr('class', 'area')
		.attr('d', area)
		.style('fill', 'url(#gradient)'); // Set gradient fill color
}

export function drawWaveform(options: DrawWaveformOptions): void {
	const { values, progress, element, margin, width, height, gradientStops1, gradientStops2 } =
		options;

	// Remove previous chart if it exists
	d3.select(element).selectAll('*').remove();

	const svg = d3
		.select(element)
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
	const x = d3.scaleLinear().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	// Define the area
	const area = d3
		.area<number>()
		.x((d, i) => x(i / values.length))
		.y0(height)
		.y1((d) => y(d))
		.curve(d3.curveBasis);

	// Scale the range of the data
	x.domain([0, 1]);
	y.domain([0, d3.max(values) as number]);

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
		.attr('d', area);

	// Add the remaining path with the second gradient
	svg
		.append('path')
		.datum(values)
		.attr('clip-path', 'url(#clip-remaining)')
		.attr('fill', 'url(#gradient2)')
		.attr('d', area);
}

interface Margin {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

interface GradientStop {
	offset: string; // e.g., "0%"
	color: string; // e.g., "rgba(255, 0, 0, 1)"
}

interface DrawWaveformBarsOptions {
	values: number[];
	progress: number;
	element: HTMLDivElement;
	margin: Margin;
	width: number;
	height: number;
	gradientStops1: GradientStop[];
	gradientStops2: GradientStop[];
	barGap: number;
	barRadius: number;
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
