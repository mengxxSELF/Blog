'use strict'

module.exports={
    default: function (req,res,next) {
        res.render('index',{title:'博客'});
    },
    user:require('./user/user'),
    article:require('./article/article'),
}