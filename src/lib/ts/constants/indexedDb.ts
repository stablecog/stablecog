import Dexie, { type Table } from 'dexie';

export interface TDBGeneration {
	id?: number;
	prompt: string;
	negative_prompt?: string;
	imageDataB64: string;
	width: number;
	height: number;
	num_inference_steps: number;
	guidance_scale: number;
	seed: number;
	server_url: string;
}

export class MySubClassedDexie extends Dexie {
	generations!: Table<TDBGeneration>;

	constructor() {
		super('stablecogDb');
		this.version(1).stores({
			generations:
				'++id, prompt, imageDataB64, width, height, num_inference_steps, guidance_scale, seed, server_url, negative_prompt' // Primary key and indexed props
		});
	}
}

export const indexedDb = new MySubClassedDexie();
