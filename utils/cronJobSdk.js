const { exec } = require('child_process');

const CronJob = require('cron').CronJob;
const job = new CronJob(
    ' * * * * *',
    () => {
        console.log('You will see this message every minute');
        exec('"C:\Program Files\EBP\PointOfSale21.1FRFR30\EBP.Invoicing.Application.exe" /BatchFile="D:\Documents\Exo-trap\EBP\Synchronisation\Sync-app\assets\import\batch\ebp-export.txt"', (error, stdout, stderr) => {
            if (error) console.log({ error });
            console.log({ stdout });
            console.error({ stderr });
        })






    },
    null,
    true,
    'Indian/Reunion'
);
// Use this if the 4th param is default value(false)
job.start()

module.exports = CronJob