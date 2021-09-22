const { exec } = require("child_process");

exec(
  'mongoimport --uri "mongodb+srv://epok:dropknee97460@cluster0.dd3wu.mongodb.net/LittoralPeche?retryWrites=true&w=majority" --type csv --headerline --ignoreBlanks --collection products --drop --file D:/LITTORAL_PECHE/EBP/SynchronisationApp/assets/test.csv',
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  }
);
