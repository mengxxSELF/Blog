'use strict'

var async = require('async');
var utils = require('../utils'); /* md5加密  */

const auth = require('../_baseClass')
const SESSION_KEY = 'connect.sid';
/* 注册*/
exports.reg = function (req,res,next) {
    var method = req.method.toLowerCase();
    if(method=='get'){
        res.render('user/reg');
    }else if(method=='post'){
        /* 存入session.json*/
        var sessions = [];
        if(auth.getSession()){
            sessions = auth.getSession();
        }
        let user={
            name:req.body.username,
            password:utils.md5(req.body.password) ,/* 密码加密*/
        }
        if(req.file){
            user.avatar = '/uploads/'+req.file.filename;
        }
        sessions.push(user);
        res.cookie('user',{name:user.name,avatar:user.avatar}); /*  将用户名发送到客户端*/
        auth.setSession(sessions);
        res.redirect('/');
    }

};
/* 登录*/
exports.login= function (req, res, next) {
    var method = req.method.toLowerCase();
    if(method=='get'){
        res.render('user/login');
    }else if(method=='post'){
        var username = req.body.username;
        var password= utils.md5(req.body.password);
        var sessions = auth.getSession();

        /* 从cookie中找到username  然后去session中找到密码  进行密码的匹配*/
        if(sessions){
            async.waterfall([function (callback) {
                var user = sessions.filter(function (item) {
                    return item.name == username;
                })
                callback(null,user[0])
            }, function (user,callback) {
                /* 比较密码是否匹配*/
                if(user.password==password){
                    callback(null,user)
                }else{
                    res.render('user/login',{error:'密码错误请重新输入'})
                    callback(null)
                }
            }], function (err,user) {
                if(err){
                    res.send({code:-1,message:'密码错误请重新输入密码'})
                }else{
                    res.cookie('user',{name:user.name,avatar:user.avatar}); /*  将用户名发送到客户端*/
                    res.redirect('/');
                }
            })

            
        }else{
           res.send({code:-1,message:'您还未注册，请先注册'})
        }
    }
}

/* 退出登录*/
exports.logout= function (req,res,next) {
    res.clearCookie('user'); /* 客户端用户名置为空*/
    res.redirect('/')
}

/* 查询当前用户是否存在*/
exports.user =function (req,res,next){
    var name = req.params.name;
    var sessions = [];
    if(auth.getSession()){
        sessions = auth.getSession();
    };
    var userArray = sessions.filter(function (item) {
        return item.name == name;
    })
    if(userArray&&userArray.length>0){
        res.json({code:0,message:'用户名已存在'})
    }else{
        res.json({code:1,message:'此用户不存在'})
    }
}