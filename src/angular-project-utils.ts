import * as vscode from "vscode";
import * as fs from "fs";
import { Logger } from "./logger";
import { TerminalUtils } from "./terminal-utils";
import * as path from 'path';
type AngularComponentType = 'Component' | 'Directive' | 'Service' | 'Module' | 'Pipe';
export class AngularProjectReader {
	private static _logger = Logger.getInstance('Angular Project Reader');

	/**
	 * returns a promise that resolves to the angular.json file if it exists else undefined
	 */
	public static async getAngularJSONFile(): Promise<vscode.Uri | undefined> {
		// check if work space has a angular.json file
		const angularJsonFiles = await this.getAngularJsonFile();
		this._logger.debug(`angular json files found:`, angularJsonFiles);
		return new Promise((resolve) => {
			if (!angularJsonFiles || angularJsonFiles.length === 0) {
				this._logger.debug(`no angular.json file found in workspace`);
				resolve(undefined);
			} else {
				this._logger.debug(`angular.json file found in workspace at [${angularJsonFiles[0].fsPath}]`);
				resolve(angularJsonFiles[0]);
			}
		});
	}

	/**
	 * @description returns the path to be used in the cli command and project context to run the cli
	 *  based on the folder on
	 * which the user has clicked after reading the project config from angular.json provided
	 * @param angularJsonFile 
	 * @param folderPath 
	 */
	public static async getCLIPathBasedOnUserClick(angularJsonFile: vscode.Uri, folderPath: string): Promise<{ path: string, project: string }> {
		// read the angular.json file
		const angularJSONFileContents = await this.readFile(angularJsonFile.fsPath, true);
		// get project src root from selected folder
		const projectSrcRoot = this.getProjectSourceRootFromPath(folderPath);
		// get project with projectSrcRoot
		const project = this.getProjectNameWithSrcRoot(angularJSONFileContents, projectSrcRoot);
		// get path to be used in cli command
		const commandPath = this.getCliCommandPathFromFullPath(folderPath);
		return { path: commandPath, project: project };
	}

	/**
	 * generates a component of given type at given path
	 */
	public static generateAngularComponent(type: AngularComponentType, path: string, project: string, addRouting: boolean = true) {
		switch (type) {
			case "Component":
				TerminalUtils.createTerminal('ng Helper', `ng g c ${path} ${this.getProjectParam(project)}`);
				break;
			case "Module":
				if (addRouting) {
					TerminalUtils.createTerminal('ng Helper', `ng g m --routing="true" ${path} ${this.getProjectParam(project)}`);
				} else {
					TerminalUtils.createTerminal('ng Helper', `ng g m ${path} ${this.getProjectParam(project)}`);
				}
				break;
			case "Service":
				TerminalUtils.createTerminal('ng Helper', `ng g s ${path} ${this.getProjectParam(project)}`);
				break;
			case "Directive":
				TerminalUtils.createTerminal('ng Helper', `ng g d ${path} ${this.getProjectParam(project)}`);
				break;
			case "Pipe":
				TerminalUtils.createTerminal('ng Helper', `ng g p ${path} ${this.getProjectParam(project)}`);
				break;
		}
	}

	/**
	 * checks for the project param passed and returns a project param that can be passed to cli
	 * if empty project param was passed return empty string
	 */
	private static getProjectParam(projectName: string): string {
		if (projectName && projectName !== '') {
			return `--project="${projectName}"`;
		}
		return '';
	}

	/**
	 * @description returns the path to be used in cli command from full selected folder path
	 */
	private static getCliCommandPathFromFullPath(folderPath: string): string {
		let commandPath = folderPath.substring(folderPath.indexOf('app') + 3);
		commandPath = this.removeLeadingAndTrailingSlashes(commandPath);
		this._logger.debug(`returning command path as [${commandPath}] for path [${folderPath}]`);
		return commandPath;
	}

	/**
	 * @description returns string after removing any leading and trailing slashes
	 * // TODO find better approach
	 */
	private static removeLeadingAndTrailingSlashes(rawString: string): string {
		if (rawString.length === 0) {
			return '';
		}
		this._logger.debug(`removing slashes from ${rawString}`);
		rawString = path.normalize(rawString);
		rawString = rawString.startsWith('\\') || rawString.startsWith('/') ? rawString.substring(1) : rawString;
		rawString = rawString.endsWith('\\') || rawString.endsWith('/') ? rawString.substring(0, rawString.length - 1) : rawString;
		this._logger.debug(`returning path after normalizing [${rawString}]`);
		return rawString;
	}

	/**
	 * returns a promise which resolves to angular.json files
	 */
	private static async getAngularJsonFile(): Promise<vscode.Uri[]> {
		const angularJsonFiles = await vscode.workspace
			.findFiles("**/angular.json", "**/node_modules/**");
		this._logger.debug(angularJsonFiles);
		return new Promise((resolve) => {
			resolve(angularJsonFiles);
		});
	}

	/**
	 * returns the name of the project which as given projectSrcRoot and empty if reuired project is default
	 * project
	 */
	private static getProjectNameWithSrcRoot(angularJSONContents: any, srcRoot: string): string {
		// get projects
		const projects = angularJSONContents.projects;
		this._logger.debug(`the projects in this workspace are`, projects);
		// get default project name
		const defaultProject = angularJSONContents.defaultProject;
		this._logger.debug(`default project for this project is [${defaultProject}]`);
		// get required project
		const requiredProject = Object.keys(projects).find(projectName => {
			this._logger.debug(`checking project [${projectName}] which has a srcRoot of [${projects[projectName].sourceRoot}]`);
			return this.checkIfPathsAreSame(projects[projectName].sourceRoot, srcRoot);
		});
		if (!requiredProject) {
			console.error(`No project found with source root [${srcRoot}]`);
			throw new Error('no project found with given srcRootPath');
		}
		this._logger.debug(`the required project is [${requiredProject}]`);
		if (requiredProject === defaultProject) {
			this._logger.debug(`the selected project is default project`);
			return '';
		}
		return requiredProject;
	}

	/**
	 * checks if two paths are equal
	 */
	private static checkIfPathsAreSame(path1: string, path2: string): boolean {
		return path.normalize(path1).replace(/\\/g, '/') === path.normalize(path2).replace(/\\/g, '/');
	}

	/**
	 * returs the project soure root path from the given path
	 */
	private static getProjectSourceRootFromPath(folderPath: string): string {
		if (vscode.workspace.workspaceFolders) {
			this._logger.debug(`calculating project src path for [${folderPath}]`);
			const workSpaceFolderPath = vscode.workspace.workspaceFolders[0];
			this._logger.debug(`work space root is [${workSpaceFolderPath.uri.fsPath}]`);
			// remove workspace root path
			folderPath = folderPath.substring(workSpaceFolderPath.uri.fsPath.length);
			// remove path appearing after app
			folderPath = folderPath.substring(0, folderPath.indexOf('app'));
			// remove trailing and leading slashes if any
			folderPath = this.removeLeadingAndTrailingSlashes(folderPath);
			this._logger.debug(`project src calculated is [${folderPath}]`);
			return folderPath;
		}
		return '';
	}

	/**
	 * reads a file from the given path and returns the content
	 */
	private static async readFile(filePath: string, asJson: boolean): Promise<Object>;
	private static async readFile(filePath: string, asJson: boolean = false): Promise<string> {
		return new Promise((resolve) => {
			fs.readFile(path.normalize(filePath), (err, data) => {
				if (data) {
					if (asJson) {
						resolve(JSON.parse(data.toString()));
					} else {
						resolve(data.toString());
					}
				}
			});
		});
	}
}
