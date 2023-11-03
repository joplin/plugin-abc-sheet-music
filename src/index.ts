import joplin from 'api';
import { ContentScriptType, SettingItemType } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		await joplin.settings.registerSection('abc', {
			label: 'ABC',
			iconName: 'fas fa-music',
		});
		
		await joplin.settings.registerSettings({
			'options': {
				value: '',
				type: SettingItemType.String,
				section: 'abc',
				public: true,
				label: 'ABC options',
				description: 'Options that should be used whenever rendering an ABC code. It must be a JSON5 object. The full list of options is available at: https://paulrosen.github.io/abcjs/visual/render-abc-options.html',
			},
		});

		await joplin.contentScripts.register(
			ContentScriptType.MarkdownItPlugin,
			'abc_music_sheet',
			'./markdownItPlugin.js',
		);
	},
});
