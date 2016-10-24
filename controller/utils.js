exports.md5= function (str) {
    return require('crypto').createHash('md5').update(str).digest('hex');
}