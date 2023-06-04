export async function audioToArray(url: string) {
	const res = await fetch(url);
	const buf = await res.arrayBuffer();
	const audioContext = new AudioContext();
	const audioBuf = await audioContext.decodeAudioData(buf);
	const filteredData = getFilteredData(audioBuf);
	const normalizedData = normalizeData(filteredData);
	return normalizedData;
}

function getFilteredData(audioBuffer: AudioBuffer) {
	const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
	const samples = 100; // Number of samples we want to have in our final data set
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
