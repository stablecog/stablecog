import type Konva from 'konva';
import { writable } from 'svelte/store';

export let KonvaInstance = writable<typeof Konva>(undefined);
export let paintLayer = writable<Konva.Layer>(undefined);
export let stage = writable<Konva.Stage>(undefined);
