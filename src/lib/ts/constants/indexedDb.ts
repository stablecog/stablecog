import type { TDBGeneration } from '$ts/types/main';
import Dexie, { type Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
	generations!: Table<TDBGeneration>;

	constructor() {
		super('stablecogDb');
		this.version(1).stores({
			generations:
				'++id, prompt, negative_prompt, imageDataB64, width, height, num_inference_steps, guidance_scale, seed, server_url, duration_ms'
		});
	}
}

export const indexedDb = new MySubClassedDexie();
