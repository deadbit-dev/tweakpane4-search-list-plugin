import { Controller, TextView, Value, ViewProps } from '@tweakpane/core';
import debounce from 'lodash.debounce';

import { Option, PluginConfig } from './types.js';
import { PluginView } from './view.js';

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<Option<string> | null>;
	public readonly textValue: Value<string>;
	public readonly options: Option<string>[];
	public readonly debounceFilterOptions: ReturnType<typeof debounce>;
	public readonly view: PluginView;
	public readonly viewProps: ViewProps;

	constructor(doc: Document, config: PluginConfig) {
		this.value = config.value;
		this.textValue = config.textValue;
		this.options = config.options;
		this.viewProps = config.viewProps;

		this.debounceFilterOptions = debounce(
			this.filterOptions,
			config.debounceDelay,
		);

		const selectedOption = config.options.find(
			(option) => option.value == config.value.rawValue?.value,
		);

		if (selectedOption) {
			this.textValue.rawValue = selectedOption.label;
		}

		this.onDrop = this.onDrop.bind(this);
		this.onDragOver = this.onDragOver.bind(this);
		this.onDragLeave = this.onDragLeave.bind(this);

		const textView = new TextView<string>(doc, {
			props: config.textProps,
			viewProps: config.viewProps,
			value: this.textValue,
		});

		// Create a custom view
		this.view = new PluginView(doc, {
			textProps: config.textProps,
			viewProps: config.viewProps,
			textView,
			value: this.value,
			options: config.options,
			noDataText: config.noDataText,
			onTextInput: this.onTextInput.bind(this),
			onOptionClick: this.onOptionClick.bind(this),
		});

		this.view.element.addEventListener('drop', this.onDrop);
		this.view.element.addEventListener('dragover', this.onDragOver);
		this.view.element.addEventListener('dragleave', this.onDragLeave);

		this.viewProps.handleDispose(() => {
			this.view.element.removeEventListener('drop', this.onDrop);
			this.view.element.removeEventListener('dragover', this.onDragOver);
			this.view.element.removeEventListener('dragleave', this.onDragLeave);
		});

		this.viewProps.handleDispose(() => {
			this.view.element.removeEventListener('drop', this.onDrop);
			this.view.element.removeEventListener('dragover', this.onDragOver);
			this.view.element.removeEventListener('dragleave', this.onDragLeave);
			// cancel debounce action
			this.debounceFilterOptions.cancel();
		});
	}

	filterOptions(text = ''): void {
		const options = this.options.filter(
			(o) => o.label.toLowerCase().indexOf(text.trim().toLowerCase()) !== -1,
		);
		options && this.view.updateOptions(options);
	}

	private onTextInput(e: Event): void {
		const inputEl = e.currentTarget as HTMLInputElement;
		const value = inputEl.value;
		this.debounceFilterOptions(value);
	}

	private onOptionClick(option: Option<string> | null) {
		this.setValue(option);
	}

	private setValue(option: Option<string> | null) {
		this.value.setRawValue(option);
		this.textValue.rawValue = option ? option.label : '';
	}

	private onDrop(event: DragEvent) {
		event.preventDefault();
		const value = this.getValueFromDrag(event);
		const option: Option<string> | null = this.getOptionFromValue(value);
		this.setValue(option);
		this.view.changeDraggingState(false);
		this.view.hideSelectOptionsBox();
	}

	private getValueFromDrag(event: DragEvent): string {
		const dataTransfer = event.dataTransfer;
		if (!dataTransfer)
			return '';
		return dataTransfer.getData('text/plain');
	}

	private getOptionFromValue(value: string): Option<string> | null {
		if (value == '')
			return null;

		const index = this.options.findIndex((option) => {
			return option.value == value;
		});

		if (index == -1)
			return null;

		return this.options[index];
	}

	private onDragOver(event: DragEvent) {
		event.preventDefault();
		this.view.changeDraggingState(true);

		// if (this.getThumbnailFromUrl(this.getUrlFromDrag(event)) == null) {
		// 	this.view.setDraggingError();
		// }
	}

	private onDragLeave() {
		this.view.changeDraggingState(false);
	}
}