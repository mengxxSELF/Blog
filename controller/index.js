'use strict'

module.exports={
    default: function (req,res,next) {
        res.redirect('/article/articles');
    },
    user:require('./user/user'),
    article:require('./article/article'),
}