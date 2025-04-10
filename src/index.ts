import type { TpPlugin } from 'tweakpane';
import { SearchListInputPlugin } from './plugin.js';

export const id = 'input-search-list';
export const css = '__css__';
export const plugins: TpPlugin[] = [SearchListInputPlugin];
