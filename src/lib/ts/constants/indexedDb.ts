import type { TIndexedDBGeneration } from '$ts/types/db';
import Dexie, { type Table } from 'dexie';

export const maxImages = 200;

export class MySubClassedDexie extends Dexie {
	generations!: Table<TIndexedDBGeneration>;

	constructor() {
		super('stablecogDb');
		this.version(1.4).stores({
			generations:
				'++id, prompt, negative_prompt, model_id, scheduler_id, width, height, num_inference_steps, guidance_scale, seed, server_url, duration_ms'
		});
	}
}

export const indexedDb = new MySubClassedDexie();
