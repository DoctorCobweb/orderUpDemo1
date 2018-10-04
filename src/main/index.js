'use strict'

import { app, BrowserWindow } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import { ipcMain } from 'electron'


const isDevelopment = process.env.NODE_ENV !== 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow

// any changes to the 'orders' table are sent on this channel to main process
ipcMain.on('change-in-orders-table', (event, arg) => {
  console.log('IPC MAIN:on \'change-in-orders-table\' event. Data:', arg)

  // TODO: send out changes to all windows.
  // Q: how does this link up with client React/Redux app??
})

const createMainWindow = () => {
  const window = new BrowserWindow()

  if (isDevelopment) {
    window.webContents.openDevTools()
  }

  if (isDevelopment) {
    // console.log(`__dirname is ${__dirname}`) // ==> src/main
    // console.log(`${JSON.stringify(process.env)}`) 
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
  }
  else {
    // 'index.html' file is dynamically created by electron-webpack 
    // using the 'html-webpack-plugin'. it's magic to me at this stage
    window.loadURL(formatUrl({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }))
  }

  window.on('closed', () => {
    mainWindow = null
  })

  window.webContents.on('devtools-opened', () => {
    window.focus()
    setImmediate(() => {
      window.focus()
    })
  })
  return window
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow()
  }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow()
})
