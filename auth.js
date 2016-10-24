const SESSION_KEY = 'connect.sid';

/* 登录*/
exports.mustLogin = function (req,res,next) {
    //console.log(req.session)
    if( req.cookies&&req.cookies.user){
        next();
    }else{
        res.redirect('/user/login')
    }
}
/* 退出登录 */
exports.mustNotLogin = function (req,res,next) {
    if(!req.cookies&&req.cookies.SESSION_KEY){
        next();
    }else{
        //res.redirect('/',{error:'您已经登录'})
    }
}
