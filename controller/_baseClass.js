'use strict'

var fs = require('fs')
var path = require('path')


exports.setSession = function (sessions ,pathObj = './session.json') {
    var sessionPath = path.resolve(__dirname,pathObj);
    console.log(sessions)
    fs.writeFileSync(sessionPath,JSON.stringify(sessions))
}
exports.getSession = function (pathObj = './session.json') {
    var sessions =[];
    var sessionPath = path.resolve(__dirname,pathObj);
    var exists = fs.existsSync(sessionPath);
    if(exists){ // 判断文件是否存在
        var cont = fs.readFileSync(sessionPath);
        if(cont){ // 如果在文件中读到内容 就转成对象
            sessions = JSON.parse(cont);
        };
    }
    return sessions;
}


