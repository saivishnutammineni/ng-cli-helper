import * as vscode from 'vscode';
export class IOUtils {
	/**
	 * Opens a box to take in user input. returns undefined if user cancels
	 */
	public static async getUserInput(): Promise<string | undefined> {
		const userData = await vscode.window.showInputBox();
		return new Promise((resolve) => {
			resolve(userData);
		});
	}

	/**
	 * @description shows a dialog box for user to select from the given options with the given placeholder
	 * @returns 
	 */
	public static async getUserSelect(options: string[], placeHolder: string): Promise<string> {
		const selectedOption = await vscode.window.showQuickPick(options, { canPickMany: false, placeHolder, ignoreFocusOut: true });
		return new Promise((resolve, reject) => {
			if (selectedOption) {
				resolve(selectedOption);
			} else {
				reject('');
			}
		});
	}
}