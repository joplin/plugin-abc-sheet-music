const JSON5 = require('json5').default;
const abcjs = require("abcjs");
const Entities = require('html-entities').AllHtmlEntities;
const htmlentities = new Entities().encode;

interface AbcContent {
	options: any;
	markup: string;
}

const parseOptions = (options:string):any => {
	options = options.trim();
	if (!options) return {};

	try {
		const o = JSON5.parse(options);
		return o ? o : {};
	} catch (error) {
		error.message = 'Could not parse options: ' + options + ': ' + error.message;
		throw error;
	}
}

const parseAbcContent = (content:string):AbcContent => {
	const pieces = content.split(/\n---\n/g);
	if (pieces.length < 2) return { markup: content.trim(), options: {} };

	return {
		markup: pieces[1].trim(),
		options: parseOptions(pieces[0]),
	};
}
export default function() { 
	return {
		plugin: function(markdownIt, pluginOptions) {
			const defaultRender = markdownIt.renderer.rules.fence || function(tokens, idx, options, env, self) {
				return self.renderToken(tokens, idx, options, env, self);
			};
		
			markdownIt.renderer.rules.fence = function(tokens, idx, options, env, self) {
				const token = tokens[idx];
				if (token.info !== 'abc') return defaultRender(tokens, idx, options, env, self);

				const elementId = 'abc_target_' + Math.random() + '_' + Date.now();
				const element = document.createElement('div');

				let html = '';

				try {
					const globalOptions = parseOptions(pluginOptions.settingValue('options'));
					const forceLightTheme = pluginOptions.settingValue('forceLightTheme');

					element.setAttribute('id', elementId);
					element.style.display = 'none';
					document.body.appendChild(element);
					const parsed = parseAbcContent(token.content);
					abcjs.renderAbc(elementId, parsed.markup, { ...globalOptions, ...parsed.options });

					const style = forceLightTheme ? 'color: black; background-color: white;' : 'color: inherit; background-color: inherit;';
					html = `<div class="abc-notation-block" style="${style}">` + element.innerHTML + '</div>';
				} catch (error) {
					console.error('ABC:', error);
					return '<div style="border: 1px solid red; padding: 10px;">Could not render ABC notation: ' + htmlentities(error.message) + '</div>';
				} finally {
					// Remove the element appears to fail when exporting to PDF ("element is not a
					// child of parent"). So we put this in a try/catch block too.
					try {
						document.body.removeChild(element);
					} catch (error) {
						console.warn('ABC: Could not remove child element:', error);
					}
				}

				return html;
			};
		},

		assets: function() {
			return [
				{
					inline: true,
					mime: 'text/css',
					text: `
						.abc-notation-block svg {
							background-color: inherit;
							color: inherit;
						}
					`,
				},
			];
		},
	}
}
