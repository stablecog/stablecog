import { indexedDb } from '$ts/constants/indexedDb';
import type { TDBGeneration } from '$ts/types/db';

const maxImages = 200;

export async function addGenerationToDb(generation: TDBGeneration) {
	console.log('Adding generation to db:', `"${generation.prompt}"`);
	const id = await indexedDb.generations.add(generation);
	console.log('Added generation to db:', id, `"${generation.prompt}"`);
	return id;
}

export async function getGenerationsFromDb() {
	const generations: TDBGeneration[] = await indexedDb.generations
		.orderBy('id')
		.reverse()
		.toArray();
	return generations;
}

export async function isStorageAvailableIfNotPrune(data: string) {
	let shouldContinuePruning = true;
	let canWrite = false;
	try {
		canWrite = await canWriteToIndexedDb();
	} catch (error) {
		console.log('isStorageAvailableIfNotPrune error', error);
	}
	while (!canWrite && shouldContinuePruning) {
		try {
			shouldContinuePruning = await pruneOneGeneration();
			canWrite = await canWriteToIndexedDb();
		} catch (error) {
			console.log(error);
			shouldContinuePruning = false;
		}
	}
	return canWrite;
}

export async function pruneOneGeneration() {
	let shouldContinuePruning = false;
	try {
		const firstGeneration = await indexedDb.generations.orderBy('id').first();
		if (firstGeneration && firstGeneration.id) {
			console.log('Pruning generation from db:', firstGeneration.id);
			await indexedDb.generations.where('id').equals(firstGeneration.id).delete();
			shouldContinuePruning = true;
		} else {
			console.log('No generations to prune');
			shouldContinuePruning = false;
		}
	} catch (error) {
		console.log(error);
		shouldContinuePruning = false;
	}
	return shouldContinuePruning;
}

export async function canWriteToIndexedDb() {
	try {
		const count = await indexedDb.generations.count();
		const remaining = maxImages - count;
		if (remaining > 0) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		return false;
	}
}
