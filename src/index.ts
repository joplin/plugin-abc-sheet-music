import joplin from 'api';
import {ContentScriptType, SettingItemType} from 'api/types';

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
				label: 'ABC render options',
				description: 'Options that should be used whenever rendering an ABC code. It must be a JSON5 object. The full list of options is available at: https://paulrosen.github.io/abcjs/visual/render-abc-options.html',
			},
			'forceLightTheme': {
				value: true,
				type: SettingItemType.Bool,
				section: 'abc',
				public: true,
				label: 'Force light theme',
				description: 'Forces the rendered output to be white and black (unless overriden by ABC render options); otherwise the sheet music will inherit the background and foreground colours of your selected theme.'
			}
		});

		await joplin.contentScripts.register(
			ContentScriptType.MarkdownItPlugin,
			'abc_music_sheet',
			'./markdownItPlugin.js',
		);
	},
});
