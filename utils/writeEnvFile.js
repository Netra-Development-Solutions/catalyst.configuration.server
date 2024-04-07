const fs = require('fs');

function writeEnvFile(envVariables) {
    let envContent = '';
    for (const envVariable in envVariables) {
        envContent += `${envVariables[envVariable].key}=${envVariables[envVariable].value[process.env.NODE_ENV]}\n`;
    }
    fs.writeFileSync('system.env', envContent);
    console.log('Environment variables written to system.env', envContent);
}

module.exports = writeEnvFile;