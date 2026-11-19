const filesys = require("fs");

filesys.writeFileSync("data.txt", "name:ABES");

console.log("File created successfully");

const filedata = filesys.readFileSync("data.txt", "utf8");

console.log(filedata);

filesys.writeFileSync("data.txt", "name:Saurabh");

console.log("File updated successfully");

const newfiledata = filesys.readFileSync("data.txt", "utf8");

console.log(newfiledata);