import { indexedDb, type TDBGeneration } from '$ts/constants/indexedDb';

export async function addGenerationToDb(generation: TDBGeneration) {
	console.log('adding generation to db', generation);
	const id = await indexedDb.generations.add(generation);
	console.log('added generation to db', id, generation);
	return id;
}

export async function getGenerationsFromDb() {
	const generations = await indexedDb.generations.orderBy('id').reverse().toArray();
	return generations;
}
