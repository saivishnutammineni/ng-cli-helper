'use strict';
import * as vscode from 'vscode';
import { AngularProjectReader } from './angular-project-utils';
import { Environment } from './environment';
import { Logger } from './logger';
import { IOUtils } from './io-utils';
import * as path from 'path';

const logger = Logger.getInstance("Extension Main");
// Extension TODO
/**
 * 3. Disable or hide the commands from menu if workspace is not a angular workspace
 * 4. Better handling of paths
 * 5. Even when packaged in dev mode no logs are shown when the extension is used. find a way to enable logs
 */

export function activate(context: vscode.ExtensionContext) {

	// create component command
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.createComponent', async (clickedFolder: vscode.Uri) => {
		const angularJsonFile = await AngularProjectReader.getAngularJSONFile();
		if (!angularJsonFile) {
			return;
		}
		// take component name to create
		const componentName = await IOUtils.getUserInput();
		if (!componentName) {
			return;
		}
		// get path to create the component
		const commandData = await AngularProjectReader.getCLIPathBasedOnUserClick(angularJsonFile, clickedFolder.fsPath);
		// create complete path with component name
		const commandPath = (commandData.path.length !== 0 ? commandData.path + path.sep : '') + componentName;
		// generate the component
		AngularProjectReader.generateAngularComponent('Component', commandPath, commandData.project);
		const message = vscode.window.setStatusBarMessage('Component Generated!!!');
		disposeMesageAfterTimeOut(message, 5000);
	}));

	// create module command
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.createModule', async (clickedFolder: vscode.Uri) => {
		const angularJsonFile = await AngularProjectReader.getAngularJSONFile();
		if (!angularJsonFile) {
			return;
		}
		// take module name to create
		const moduleName = await IOUtils.getUserInput();
		if (!moduleName) {
			return;
		}
		// ask if routing is needed
		let isRoutingModuleRequired = await IOUtils.getUserSelect(['Yes', 'No'], 'Do you need a routing module?');
		if (!isRoutingModuleRequired) {
			isRoutingModuleRequired = 'No';
		}
		// get path to create the component
		const commandData = await AngularProjectReader.getCLIPathBasedOnUserClick(angularJsonFile, clickedFolder.fsPath);
		// create complete path with component name
		const commandPath = (commandData.path.length !== 0 ? commandData.path + path.sep : '') + moduleName;
		// generate the module
		AngularProjectReader.generateAngularComponent('Module', commandPath, commandData.project, isRoutingModuleRequired === 'Yes');
		const message = vscode.window.setStatusBarMessage('Module Generated!!!');
		disposeMesageAfterTimeOut(message, 5000);
	}));

	// create service command
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.createService', async (clickedFolder: vscode.Uri) => {
		const angularJsonFile = await AngularProjectReader.getAngularJSONFile();
		if (!angularJsonFile) {
			return;
		}
		// take service name to create
		const serviceName = await IOUtils.getUserInput();
		if (!serviceName) {
			return;
		}
		// get path to create the component
		const commandData = await AngularProjectReader.getCLIPathBasedOnUserClick(angularJsonFile, clickedFolder.fsPath);
		// create complete path with component name
		const commandPath = (commandData.path.length !== 0 ? commandData.path + path.sep : '') + serviceName;
		// generate the service
		AngularProjectReader.generateAngularComponent('Service', commandPath, commandData.project);
		const message = vscode.window.setStatusBarMessage('Service Generated!!!');
		disposeMesageAfterTimeOut(message, 5000);
	}));

	// create directive command
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.createDirective', async (clickedFolder: vscode.Uri) => {
		const angularJsonFile = await AngularProjectReader.getAngularJSONFile();
		if (!angularJsonFile) {
			return;
		}
		// take directive name to create
		const directiveName = await IOUtils.getUserInput();
		if (!directiveName) {
			return;
		}
		// get path to create the component
		const commandData = await AngularProjectReader.getCLIPathBasedOnUserClick(angularJsonFile, clickedFolder.fsPath);
		// create complete path with component name
		const commandPath = (commandData.path.length !== 0 ? commandData.path + path.sep : '') + directiveName;
		// generate the directive
		AngularProjectReader.generateAngularComponent('Directive', commandPath, commandData.project);
		const message = vscode.window.setStatusBarMessage('Directive Generated!!!');
		disposeMesageAfterTimeOut(message, 5000);
	}));

	// create pipe command
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.createPipe', async (clickedFolder: vscode.Uri) => {
		const angularJsonFile = await AngularProjectReader.getAngularJSONFile();
		if (!angularJsonFile) {
			return;
		}
		// take pipe name to create
		const pipeName = await IOUtils.getUserInput();
		if (!pipeName) {
			return;
		}
		// get path to create the component
		const commandData = await AngularProjectReader.getCLIPathBasedOnUserClick(angularJsonFile, clickedFolder.fsPath);
		// create complete path with component name
		const commandPath = (commandData.path.length !== 0 ? commandData.path + path.sep : '') + pipeName;
		// generate the pipe
		AngularProjectReader.generateAngularComponent('Pipe', commandPath, commandData.project);
		const message = vscode.window.setStatusBarMessage('Pipe Generated!!!');
		disposeMesageAfterTimeOut(message, 5000);
	}));

	// create guard command
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.createGuard', async (clickedFolder: vscode.Uri) => {
		const angularJsonFile = await AngularProjectReader.getAngularJSONFile();
		if (!angularJsonFile) {
			return;
		}
		// take guard name to create
		const guardName = await IOUtils.getUserInput();
		if (!guardName) {
			return;
		}
		// get path to create the component
		const commandData = await AngularProjectReader.getCLIPathBasedOnUserClick(angularJsonFile, clickedFolder.fsPath);
		// create complete path with component name
		const commandPath = (commandData.path.length !== 0 ? commandData.path + path.sep : '') + guardName;
		// generate the component
		AngularProjectReader.generateAngularComponent('Guard', commandPath, commandData.project);
		const message = vscode.window.setStatusBarMessage('Guard Generated!!!');
		disposeMesageAfterTimeOut(message, 5000);
	}));


	// enabling debug mode
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.enableDebugMode', () => {
		Environment.setEnvironment('dev');
		const message = vscode.window.setStatusBarMessage('Enabled Debug Mode');
		disposeMesageAfterTimeOut(message, 5000);
	}));

	// enabling prod mode
	context.subscriptions.push(vscode.commands.registerCommand('ngHelper.enableProdMode', () => {
		Environment.setEnvironment('prod');
		const message = vscode.window.setStatusBarMessage('Enabled Prod Mode');
		disposeMesageAfterTimeOut(message, 5000);
	}));
}

/**
 * @description disposes the given message after given timeout (in ms)
 */
function disposeMesageAfterTimeOut(message: vscode.Disposable, timeout: number) {
	setTimeout(() => {
		message.dispose();
	}, timeout);
}