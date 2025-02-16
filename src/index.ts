import type { TpPlugin } from 'tweakpane';
import { TemplateInputPlugin } from './plugin.js';

export const id = 'input-template';
export const css = '__css__';
export const plugins: TpPlugin[] = [TemplateInputPlugin];
