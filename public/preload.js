const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    getArgs: () => ipcRenderer.invoke('get-args'),
    getInputData: () => ipcRenderer.invoke('get-input-data'),
    getOutputData: () => ipcRenderer.invoke('get-output-data'),
    saveOutputData: (action) => ipcRenderer.invoke('save-output-data', action),
    getFileFromPath: (action) => ipcRenderer.invoke('get-file-from-path', action),
    writeFileToPath: () => ipcRenderer.invoke('write-file-to-path'),
    // we can also expose variables, not just functions
})
