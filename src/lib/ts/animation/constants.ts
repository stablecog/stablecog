import { quadOut } from 'svelte/easing';

export const modalInTransitionProps = { easing: quadOut, y: 50, duration: 200 };
export const modalOutTransitionProps = { easing: quadOut, y: 50, duration: 200 };
export const modalBgTransitionProps = { easing: quadOut, duration: 250 };
export const imageTransitionProps = { easing: quadOut, y: -50, duration: 200 };
