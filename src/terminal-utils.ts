import * as vscode from 'vscode';
import { Logger } from './logger';
export class TerminalUtils {
	private static _logger = Logger.getInstance('Terminal Utils');
	public static createTerminal(termianlName: string, commandToRun: string) {
		// check if terminal exists with same name
		let terminal = this.getTerminal(termianlName);
		if (!terminal) {
			// no terminal with same name. create new
			terminal = vscode.window.createTerminal(termianlName);
		}
		// show the terminal in UI
		terminal.show();
		this._logger.debug(`running command [${commandToRun}] on terminal [${termianlName}]`);
		// run the command
		terminal.sendText(commandToRun);
	}

	/**
	 * @description returns a terminal with the given name from the open terminals
	 * if no terminal is found returns undefined
	 * @param terminalName 
	 */
	private static getTerminal(terminalName: string): vscode.Terminal | undefined {
		return vscode.window.terminals.find(terminal => {
			return terminal.name === terminalName;
		});
	}
}
