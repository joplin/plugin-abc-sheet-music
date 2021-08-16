const abcjs = require("abcjs");
const Entities = require('html-entities').AllHtmlEntities;
const htmlentities = new Entities().encode;

export default function() { 
	return {
		plugin: function(markdownIt, _options) {
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
					element.setAttribute('id', elementId);
					element.style.display = 'none';
					document.body.appendChild(element);
					abcjs.renderAbc(elementId, token.content.trim());
					html = element.innerHTML;
				} catch (error) {
					console.error(error);
					return '<div style="border: 1px solid red; padding: 10px;">Could not render ABC notation: ' + htmlentities(error.message) + '</div>';
				} finally {
					document.body.removeChild(element);
				}

				return html;
			};
		},
	}
}
