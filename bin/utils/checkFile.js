const fs = require('fs');

/**
 * Checks if a file exists and return its contents
 * @param {string} fileName the path of the file to check/get
 * @param {boolean} updateDir whether to update current dir or not
 */
function checkFile(fileName, updateDir = false) {
  if (fs.lstatSync(fileName).isDirectory()) {
    fileName = fileName.replace(/\/|\\/g, '/');
    fileName = fileName.split('/').filter(Boolean); // remove all falsy values
    fileName.push('index.swh'); // default to index
    fileName = fileName.join('/');
  }

  if (fs.existsSync(fileName)) {
    let output = fs.readFileSync(fileName, 'utf8');

    // update the process cwd if they run a file in some deeply nested dir
    if (updateDir) {
      if (fileName.includes('/')) {
        let parent = fileName.substr(0, fileName.lastIndexOf('/'));
        process.chdir(parent);
      }
    }

    return output;
  } else {
    throw new Error('File not found');
  }
}

module.exports = checkFile;
