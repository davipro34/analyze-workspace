import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let filesToAnalyze: Set<string> = new Set();

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.collectWorkspaceContext', () => {
        let collectedContext: string[] = [];
        filesToAnalyze.forEach(filePath => {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                console.log(`Reading file: ${filePath}`); // Debugging line
                collectedContext.push(`File: ${filePath}\n${data}\n`);
            } catch (err) {
                console.error(`Error reading file ${filePath}: ${err}`);
            }
        });
        vscode.window.showInformationMessage('Workspace context collected.');
        showCollectedContext(collectedContext.join('\n'));
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.addFileToAnalysis', (uri: vscode.Uri) => {
        if (uri && uri.fsPath) {
            addFilesRecursively(uri.fsPath);
            vscode.window.showInformationMessage(`Added ${uri.fsPath} to analysis.`);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('extension.removeFileFromAnalysis', (uri: vscode.Uri) => {
        if (uri && uri.fsPath) {
            removeFilesRecursively(uri.fsPath);
            vscode.window.showInformationMessage(`Removed ${uri.fsPath} from analysis.`);
        }
    }));
}

function addFilesRecursively(filePath: string) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(filePath);
        files.forEach(file => {
            const fullPath = path.join(filePath, file);
            addFilesRecursively(fullPath);
        });
    } else {
        filesToAnalyze.add(filePath);
        console.log(`Added file to analysis: ${filePath}`); // Debugging line
    }
}

function removeFilesRecursively(filePath: string) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(filePath);
        files.forEach(file => {
            const fullPath = path.join(filePath, file);
            removeFilesRecursively(fullPath);
        });
    } else {
        filesToAnalyze.delete(filePath);
        console.log(`Removed file from analysis: ${filePath}`); // Debugging line
    }
}

function showCollectedContext(context: string) {
    const outputChannel = vscode.window.createOutputChannel('Collected Context');
    outputChannel.clear();
    outputChannel.appendLine(context);
    outputChannel.show();
    console.log('Collected context displayed.');
}

export function deactivate() {}
