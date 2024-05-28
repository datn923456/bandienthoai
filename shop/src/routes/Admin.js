const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../app/models/User')


const adminController =require('../app/controllers/AdminController');

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

var checkAdmin = (req,res, next) => {
    if(req.data){
        var role = req.data.role;
        if(role === 'admin'){
            next()
        }else if(role === 'user'){
            res.redirect("/home");
        }
    }else if(!req.data){
        res.redirect("/home")
    }
}

router.get('/admin',checkLogin,checkAdmin, adminController.showIndexAdmin);
router.get('/admin/update-phone',checkLogin,checkAdmin, adminController.showUpdatePhone);
router.get('/admin/:id/edit',checkLogin,checkAdmin, adminController.showUpdatePhoneInfo);
router.get('/admin/users',checkLogin,checkAdmin, adminController.showUsers);
router.get('/admin/users/:id/edit',checkLogin,checkAdmin, adminController.showUsersEdit);
router.get('/admin/users/:id/delete',checkLogin,checkAdmin, adminController.showUsersDelete);

router.put('/admin/users/:id/edited',checkLogin,checkAdmin, adminController.showUsersEdited);
router.delete('/admin/users/:id/deleted',checkLogin,checkAdmin, adminController.showUsersDeleted);
router.put('/admin/:id', adminController.showUpdatePhoneEdit);
router.get('/admin/:id/delete', adminController.showUpdatePhoneDelete);
router.delete('/admin/:id/deleted', adminController.showUpdatePhoneDeleted);

router.get('/admin/addinfo', adminController.addinfo);
router.post('/admin/added', adminController.added);

module.exports = router;
