const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../app/models/User')

const userController =require('../app/controllers/UserController');

var checkLogin = (req,res, next) => {
    var token = req.cookies?.token;
    if(!token){
        next();
    }else{
        var idUser = jwt.verify(token, 'mk');
        User.findOne({_id : idUser._id})
            .then(data =>{
                req.data = data;
                next();
            }).catch(err =>{
                console.log(err.message);
                
            })
    }
}

var checkUser = (req,res, next) => {
    if(req.data){
        var role = req.data.role;
        if(role === 'user'){
            res.redirect("/home");
        }else if(role === 'admin'){
            res.redirect("/admin");
        }
    }else if(!req.data){
        next();
    }
}

router.get('/register', userController.register);
router.get('/login',checkLogin,checkUser, userController.login);
router.get('/home',checkLogin, userController.showIndexUser);
router.get('/order',checkLogin, userController.showOrder);
router.get('/home/:id', userController.showInfoPhone);

router.post('/update-order/:id', userController.updateOrder);
router.delete('/delete-order/:id', userController.deleteOrder);
router.post('/order/:id', userController.addPhoneGioHang);
router.post('/created', userController.created);
router.post('/logined', userController.logined);
router.get('/logout', function(req,res){
    res.clearCookie('token');
    res.redirect('/login');
})

module.exports = router;