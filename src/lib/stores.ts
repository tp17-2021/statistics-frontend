import {writable} from "svelte/store";

export const authenticated = writable(false)
export const jwt = writable(null)