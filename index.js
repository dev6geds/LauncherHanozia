const {app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
      title : "ok",
      //icon: path.join(__dirname, "/asset/logo.ico"),
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL(path.join(__dirname, "index.html"))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("login",(event, data) => {
    
    Authenticator.getAuth(data.u).then(() => {
        event.sender.send("done");
          let opts = {
        clientPackage: "https://hanozia.fr/modpack.zip",
        // For production launchers, I recommend not passing 
        // the getAuth function through the authorization field and instead
        // handling authentication outside before you initialize
        // MCLC so you can handle auth based errors and validation!
        authorization: Authenticator.getAuth("username"),
        root: "./minecraft",
      
        version: {
            number: "1.7.10",
            type: "release"
        },
        forge: 'forge.jar',
        memory: {
            max: "6G",
            min: "4G",
        }
        
    }
    
    launcher.launch(opts);
    
    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
    }).catch((err)=>{

    });

  
})