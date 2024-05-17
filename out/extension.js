"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let filesToAnalyze = new Set();
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('extension.collectWorkspaceContext', () => {
        let collectedContext = [];
        filesToAnalyze.forEach(filePath => {
            try {
                const data = fs.readFileSync(filePath, 'utf8');
                console.log(`Reading file: ${filePath}`); // Debugging line
                collectedContext.push(`File: ${filePath}\n${data}\n`);
            }
            catch (err) {
                console.error(`Error reading file ${filePath}: ${err}`);
            }
        });
        vscode.window.showInformationMessage('Workspace context collected.');
        showCollectedContext(collectedContext.join('\n'));
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.addFileToAnalysis', (uri) => {
        if (uri && uri.fsPath) {
            addFilesRecursively(uri.fsPath);
            vscode.window.showInformationMessage(`Added ${uri.fsPath} to analysis.`);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.removeFileFromAnalysis', (uri) => {
        if (uri && uri.fsPath) {
            removeFilesRecursively(uri.fsPath);
            vscode.window.showInformationMessage(`Removed ${uri.fsPath} from analysis.`);
        }
    }));
}
exports.activate = activate;
function addFilesRecursively(filePath) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(filePath);
        files.forEach(file => {
            const fullPath = path.join(filePath, file);
            addFilesRecursively(fullPath);
        });
    }
    else {
        filesToAnalyze.add(filePath);
        console.log(`Added file to analysis: ${filePath}`); // Debugging line
    }
}
function removeFilesRecursively(filePath) {
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
        const files = fs.readdirSync(filePath);
        files.forEach(file => {
            const fullPath = path.join(filePath, file);
            removeFilesRecursively(fullPath);
        });
    }
    else {
        filesToAnalyze.delete(filePath);
        console.log(`Removed file from analysis: ${filePath}`); // Debugging line
    }
}
function showCollectedContext(context) {
    const outputChannel = vscode.window.createOutputChannel('Collected Context');
    outputChannel.clear();
    outputChannel.appendLine(context);
    outputChannel.show();
    console.log('Collected context displayed.');
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map