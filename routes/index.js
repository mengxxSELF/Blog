'use strict'

const express = require('express');
const router = express.Router();
const web = require('../controller')
const auth =require('../auth')

/* 头像上传*/
var multer = require('multer');
var path = require('path')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.resolve(__dirname,'../public/uploads/'))
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})
var upload = multer({ storage: storage })



router.get('/',web.default);/* 首页*/

/* 用户 */
router.get('/user/reg',web.user.reg); /* 注册*/
router.post('/user/reg',upload.single('avatar'),web.user.reg); /* 注册*/
router.get('/user/login',web.user.login); /* 登录*/
router.post('/user/login',web.user.login); /* 登录*/
router.get('/user/user/:name',web.user.user); /* 查询用户*/

router.get('/user/logout',web.user.logout); /* 退出登录*/

/* 文章*/
router.get('/article/articles',web.article.articles); /*文章列表*/
router.get('/article/article',auth.mustLogin ,web.article.create); /*文章发表*/
router.post('/article/article',/*[auth.mustLogin] ,*/web.article.create); /*发表文章*/
router.get('/article/article/:id',web.article.article); /*文章详情*/
router.post('/article/article/:id',web.article.article); /*文章修改*/
router.delete('/article/article/:id',web.article.article); /*文章删除*/






module.exports = router;
