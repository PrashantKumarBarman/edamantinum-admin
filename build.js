const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exec("npm run build", (error, stdout, stderr) => {
    if(error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if(stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);

    let source = __dirname + path.sep + "build";
    let destination = __dirname + path.sep + ".." + path.sep + ".." + path.sep + "backend" + path.sep + "build";
    fs.rename(source, destination, function(err) {
        if(err) {
            throw err
        }
        else {
            console.log("Successfully moved the file!");
        }
    });

    console.log("Build completed successfully");
});
