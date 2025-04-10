import {TextProps, Value, ViewProps} from '@tweakpane/core';

export interface Option<Value> {
	label: string;
	value: Value;
}

export interface PluginConfig {
	value: Value<Option<string> | null>;
	textValue: Value<string>;
	options: Option<string>[];
	noDataText: string;
	debounceDelay: number;
	textProps: TextProps<string>;
	viewProps: ViewProps;
}
