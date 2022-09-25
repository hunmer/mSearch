
let path = __dirname + '\\bin\\'
console.log(path)
console.log(require('child_process').execFile(path + 'aria2c_start.bat', [], { cwd: path }, function(error, stdout, stderr) {
    console.log(error);
    console.log(stdout)
}))