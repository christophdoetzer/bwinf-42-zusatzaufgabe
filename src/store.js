import { writable } from 'svelte/store';

export let selected = writable('-');
export let field = writable([['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']]);
export let lights = writable([0]);
export let originalLights = writable([0]);
export let potentialSources = writable(['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']);
export let finalLights = writable(['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X']);
export let hoversOverMainFields = writable(false);

export let width = writable(8);
export let height = writable(8);
export let wayOfLights = writable(true);
export let previewPlacement = writable(true);
export let soundEffects = writable(false);
export let wayOfLightArr = writable([[1, 0]])

export let deletingButtons = writable([[1, 0]])

export let preview = writable([[1, 2]]);
preview.update(arr => [...arr, [2, 2]])

for (let i = 0; i < 7; i++) {
    let row = ['X']
    for (let j = 0; j < 7; j++) {
        row.push('X');
    }
    field.update(arr => [...arr, row])
}
