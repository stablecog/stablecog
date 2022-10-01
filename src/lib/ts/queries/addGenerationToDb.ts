import { db, type TDBGeneration } from '$ts/constants/db';

export async function addGenerationToDb(generation: TDBGeneration) {
	console.log('adding generation to db', generation);
	const id = await db.generations.add(generation);
	console.log('added generation to db', id, generation);
	return id;
}
