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
		.x((d, i) => x(i / (values.length - 1))) // Adjust here
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
	offset: string;
	color: string;
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

interface MarginAnimation {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

interface GradientStopAnimation {
	offset: string;
	color: string;
}

interface DrawWaveformAnimationOptions {
	element: HTMLDivElement;
	margin: MarginAnimation;
	width: number;
	barWidth: number;
	height: number;
	gradientStop: GradientStopAnimation[];
	duration: number;
	maxHeightChange: number; // Adjusted to accept a value between 0 and 1
	minHeight: number;
}

export function drawWaveformAnimation(options: DrawWaveformAnimationOptions): void {
	const {
		element,
		margin,
		width,
		barWidth,
		height,
		gradientStop,
		duration,
		maxHeightChange,
		minHeight
	} = options;

	const valueCount = Math.ceil(width / barWidth);

	// Generate initial random values between minHeight and 1
	let values: number[] = Array.from(
		{ length: valueCount },
		() => minHeight + Math.random() * (1 - minHeight)
	);

	// Remove previous chart if it exists
	d3.select(element).selectAll('*').remove();

	const svg = d3
		.select(element)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Define gradient
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

	createGradient('gradient', gradientStop);

	// Set the ranges
	const x = d3.scaleLinear().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	// Define the area
	const area = d3
		.area<number>()
		.x((d, i) => x(i / (valueCount - 1))) // Adjust here
		.y0(height)
		.y1((d) => y(d))
		.curve(d3.curveBasis);

	// Scale the range of the data
	x.domain([0, 1]);
	y.domain([0, 1]);

	// Add the path with the gradient
	const path = svg.append('path').datum(values).attr('fill', 'url(#gradient)').attr('d', area);

	// Function to generate new random values and redraw the path
	const animateWaveform = () => {
		// Create new random values for the next state
		const nextValues = values.map((value) => {
			const maxDiff = maxHeightChange;
			const newValue = Math.min(Math.max(minHeight, value + (Math.random() * 2 - 1) * maxDiff), 1);
			return newValue;
		});
		values = nextValues;

		y.domain([0, 1]);

		// Transition to the next state
		path
			.datum(nextValues)
			.transition()
			.duration(duration)
			.ease(d3.easeSinInOut)
			.attr('d', area)
			.on('end', animateWaveform);
	};

	// Start the animation
	animateWaveform();
}

interface DrawWaveformAnimationOptions {
	element: HTMLDivElement;
	margin: MarginAnimation;
	width: number;
	barWidth: number;
	height: number;
	gradientStop: GradientStopAnimation[];
	duration: number;
	maxHeightChange: number; // Adjusted to accept a value between 0 and 1
	minHeight: number;
	hasInfiniteAnimation: boolean;
	values?: number[];
}

export function drawWaveformAnimation2(options: DrawWaveformAnimationOptions): void {
	const {
		element,
		margin,
		width,
		barWidth,
		height,
		gradientStop,
		duration,
		maxHeightChange,
		minHeight,
		hasInfiniteAnimation,
		values: inputValues
	} = options;

	const valueCount = Math.ceil(width / barWidth);

	let values: number[];

	// check if a values array is passed, if not create one randomly
	if (inputValues) {
		// if values array is passed, interpolate or slice to fit it to valueCount
		const d3Interpolator = d3.interpolateArray(inputValues, Array(valueCount).fill(0));
		values = Array.from({ length: valueCount }, (_, i) => d3Interpolator(i / valueCount));
	} else if (element.dataset.lastValues) {
		// if no values array is passed, check if there is a previous state to restore
		values = JSON.parse(element.dataset.lastValues);
	} else {
		// if no values array and no previous state, create a random values array
		values = Array.from({ length: valueCount }, () => minHeight + Math.random() * (1 - minHeight));
	}

	// Remove previous chart if it exists
	d3.select(element).selectAll('*').remove();

	const svg = d3
		.select(element)
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Define gradient
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

	createGradient('gradient', gradientStop);

	// Set the ranges
	const x = d3.scaleLinear().range([0, width]);
	const y = d3.scaleLinear().range([height, 0]);

	// Define the area
	const area = d3
		.area<number>()
		.x((d, i) => x(i / (valueCount - 1))) // Adjust here
		.y0(height)
		.y1((d) => y(d))
		.curve(d3.curveBasis);

	// Scale the range of the data
	x.domain([0, 1]);
	y.domain([0, 1]);

	// Add the path with the gradient
	const path = svg.append('path').datum(values).attr('fill', 'url(#gradient)').attr('d', area);

	// Function to generate new random values and redraw the path
	const animateWaveform = () => {
		let nextValues: number[];

		// only animate infinitely if hasInfiniteAnimation is true
		if (hasInfiniteAnimation) {
			// create new random values for the next state
			nextValues = values.map((value) => {
				const maxDiff = maxHeightChange;
				const newValue = Math.min(
					Math.max(minHeight, value + (Math.random() * 2 - 1) * maxDiff),
					1
				);
				return newValue;
			});
		} else {
			// if not infinitely animating, just use current values for the next state
			nextValues = values;
		}
		values = nextValues;

		// transition to the next state
		path
			.datum(nextValues)
			.transition()
			.duration(duration)
			.ease(d3.easeLinear)
			.attr('d', area)
			.on('end', () => {
				if (hasInfiniteAnimation) {
					animateWaveform();
				}
			});
	};

	// Start the animation
	animateWaveform();

	// Store the last state of values on the element
	element.dataset.lastValues = JSON.stringify(values);
}
