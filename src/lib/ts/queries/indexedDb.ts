import { indexedDb } from '$ts/constants/indexedDb';
import type { TDBGeneration } from '$ts/types/db';

export async function addGenerationToDb(generation: TDBGeneration) {
	console.log('adding generation to db:', `"${generation.prompt}"`);
	const id = await indexedDb.generations.add(generation);
	console.log('added generation to db:', id, `"${generation.prompt}"`);
	return id;
}

export async function getGenerationsFromDb() {
	const generations = await indexedDb.generations.orderBy('id').reverse().toArray();
	return generations;
}

export async function pruneGenerationsFromDb() {
	const generations = await indexedDb.generations.count();
	console.log('count', generations);
}
