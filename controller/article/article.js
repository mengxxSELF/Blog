'use strict'

var async = require('async');

const auth = require('../_baseClass')
const pathObj = './articles.json';
const SESSION_KEY = 'connect.sid';

/* 文章列表*/
exports.articles = function (req,res,next) {
    var method = req.method.toLowerCase();
    if(method=='get'){
        var sessions = [];
        if(auth.getSession()){
            sessions = auth.getSession(pathObj);
        };
        var result =[];

        /* 文章分页*/
        var pageNum = parseInt(req.query.pageNum) || 1; /* 当前页数*/
        var pageSize = parseInt(req.query.pageSize) || 2; /* 每页最大文章数目*/

        var totalPage = Math.ceil(sessions.length/pageSize); /* 文章总数*/
        if(req.params.username){
            /* 个人文章列表*/
            result = sessions.filter(function (item) {
                return item.user == req.params.username;
            });
        }else{
            result  = sessions.reverse(); /* 全部文章*/
        }
        result = result.splice((pageNum-1)*pageSize,pageSize);  /* 分页*/
        res.render('article/articles',{articles:result,totalPage:totalPage,NowPageNum:pageNum});
    }
};
/* 添加文章*/
exports.create = function (req,res,next) {
    var method = req.method.toLowerCase();

    if(method=='get'){
        res.render('article/article');
    }else if(method=='post'){
        var article = req.body;
        //取得请求头中的cookie对象
        var cookies = req.cookies;
        //取得此客户端的username
        var username = cookies['user'].name;

        article.user = username;
        article.time = new Date();

        /* 取出article.json*/
        var sessions = [];
        if(auth.getSession(pathObj)){
            sessions = auth.getSession(pathObj);
        }
        if(sessions.length==0){
            article.id = 0
        }else{
            article.id = parseInt(sessions[sessions.length-1].id)+1;
        }


        /* 将文章插入数据文件*/
        async.series([function (callback) {
            sessions.push(article);
            callback(null,sessions)
        }], function (err,result) {
            if(result){
                auth.setSession(sessions,pathObj);
                res.redirect('/article/articles')
            }
        })

    }
}

/* 文章详情  编辑 删除*/
exports.article = function (req,res,next) {
    var method = req.method.toLowerCase();
    var title= req.params.title;
    if(method=='get'){
        var sessions = [];
        if(auth.getSession()){
            sessions = auth.getSession(pathObj);
        };
        var result =[];
        if(req.params.id) {
            /* 根据id找到文章*/
            result = sessions.filter(function (item) {
                return item.id == req.params.id;
            });
        }

        if(result.length>0){
            res.render('article/article',{article:result[0]});
        }else{
            res.redirect('/article/articles');
        }

    }else if(method=='post'){
        var update = req.body;

        /* 取出article.json*/
        var sessions = [];
        if(auth.getSession(pathObj)){
            sessions = auth.getSession(pathObj);
        }
        /* 将文章更新数据文件*/
        async.waterfall([function (callback) {
            sessions.forEach(function (item,index) {
                if(item.id==req.params.id){
                    callback(null,index)
                }
            })
        }, function (index,callback) {
            /* 更新文章*/
            sessions[index].title = update.title;
            sessions[index].content = update.content;
            sessions[index].updateTime = new Date(); /* 增添更新字段*/
            callback(null,sessions)
        }], function (err,sessions) {
            if(sessions){
                auth.setSession(sessions,pathObj);
                res.redirect('/article/articles')
            }
        })


    }else if(method=='delete'){
        /* 删除*/
        /* 取出article.json*/
        var sessions = [];
        if(auth.getSession(pathObj)){
            sessions = auth.getSession(pathObj);
        }
        /* 更新文章数据文件*/
        async.waterfall([function (callback) {
            sessions = sessions.filter(function (item) {
                return item.id != req.params.id
            })
            callback(null,sessions)
        }], function (err,sessions) {
            console.log(sessions)
            if(sessions){
                auth.setSession(sessions,pathObj);
                res.json({code:0})
            }
        })


    }
}

