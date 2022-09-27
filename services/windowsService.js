const Service = require('node-windows').Service;

// const scriptPath = 'D:\\LITTORAL_PECHE\\EBP\\SynchronisationApp\\server.js';
const scriptPath = 'D:\\Documents\\Exo-trap\\EBP\\Synchronisation\\Sync-app\\server.js';



const svc = new Service({
    name: 'Exo-Trap Sync App',
    description: 'Logiciel de synchronisation EBP vers base de données.',
    script: scriptPath,
    // nodeOptions: [
    //     '--harmony',
    //     '--max_old_space_size=4096'
    // ]
    //, workingDirectory: '...'
    //, allowServiceLogon: true
});

svc.on('install', function () {
    svc.start();
});

svc.install();
