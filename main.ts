import { Plugin, WorkspaceLeaf, normalizePath } from "obsidian";

export default class SyncGraphPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: "sync-graph-colorgroups-to-localgraph",
			name: "Sync Graph Settings to Local Graph",
			callback: async () => {
				await this.syncGlobalToLocal();
			},
		});
	}

	async syncGlobalToLocal() {
		const configDir = this.app.vault.configDir;
		const graphConfigPath = normalizePath(configDir + "/graph.json");

		// this.app.vault.getAbstractFileByPath('.obsidian/graph.json') would return null
		// So we're doing it the less safe way
		const graphConfigJson =
			await this.app.vault.adapter.read(graphConfigPath);
		console.log("Hello");
		console.log(graphConfigJson);
		const graphConfig = JSON.parse(graphConfigJson);
		const graphColorGroups = graphConfig.colorGroups;
		const searchFilters = graphConfig.search;
		const showArrow = graphConfig.showArrow;
		const showTags = graphConfig.showTags;
		const showOrphans = graphConfig.showOrphans;
		this.getLocalGraphLeaves().forEach((leaf) => {
			this.setSettings(
				leaf,
				graphColorGroups,
				searchFilters,
				showArrow,
				showTags,
				showOrphans,
			);
		});
	}

	getLocalGraphLeaves() {
		return this.app.workspace.getLeavesOfType("localgraph");
	}

	setSettings(
		localGraphLeaf: WorkspaceLeaf,
		colorGroups: any,
		searchFilters: any,
		showArrow: boolean,
		showTags: boolean,
		showOrphans: boolean,
	) {
		const viewState = localGraphLeaf.getViewState();
		viewState.state.options.colorGroups = colorGroups;
		viewState.state.options.search = searchFilters;
		viewState.state.options.showArrow = showArrow;
		viewState.state.options.showTags = showTags;
		viewState.state.options.showOrphans = showOrphans;
		viewState.state.options.localInterlinks = true;
		localGraphLeaf.setViewState(viewState);
	}
}
