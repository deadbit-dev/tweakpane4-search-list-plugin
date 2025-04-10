import {
	BindingTarget,
	CompositeConstraint,
	createListConstraint,
	createValue,
	createPlugin,
	InputBindingPlugin,
	StringInputParams,
	ValueMap,
} from '@tweakpane/core';

import { PluginController } from './controller.js';
import { Option } from './types.js';

interface PluginInputParams extends StringInputParams {
	noDataText?: string;
	debounceDelay?: number;
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const SearchListInputPlugin: InputBindingPlugin<
	Option<string> | null,
	string,
	PluginInputParams
> = createPlugin({
	id: 'input-search-list',
	type: 'input',

	accept(exValue: unknown, params: Record<string, unknown>) {
		if (params.view !== 'search-list' || typeof exValue !== 'string')
			return null;

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue,
			params,
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): Option<string> | null => {
				// Convert an external string value into the internal Option value
				if (typeof exValue !== 'string') return null;
				return { label: exValue, value: exValue };
			};
		},

		constraint(args) {
			// Create a value constraint from the user input
			const constraints = [];
			// You can reuse existing functions of the default plugins
			const cr = createListConstraint<string>(args.params.options);
			if (cr) {
				constraints.push({
					constrain: (value: Option<string> | null) => {
						if (!value) return null;
						const constrainedLable = cr.constrain(value.label);
						const constrainedValue = cr.constrain(value.value);
						return { label: constrainedLable, value: constrainedValue };
					}
				});
			}
			return new CompositeConstraint<Option<string> | null>(constraints);
		},

		writer(_args) {
			return (target: BindingTarget, inValue: Option<string> | null) => {
				// Write the value property of the option to the target
				target.write(inValue?.value ?? '');
			};
		},
	},

	controller(args) {
		const params = args.params as PluginInputParams;
		const optionsFromParams = (params.options || {}) as StringInputParams;
		const options = Object.keys(optionsFromParams).map((key) => {
			return {
				label: key,
				value: optionsFromParams[key as keyof StringInputParams],
			} as Option<string>;
		});

		// Create a controller for the plugin
		return new PluginController(args.document, {
			value: args.value,
			textValue: createValue(''),
			options,
			noDataText: params.noDataText || 'no data',
			debounceDelay: params.debounceDelay || 250,
			textProps: ValueMap.fromObject({
				formatter: (val: any) => String(val),
			}),
			viewProps: args.viewProps,
		});
	},
});
