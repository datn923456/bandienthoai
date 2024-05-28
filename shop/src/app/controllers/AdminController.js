const User = require('../models/User');
const DienThoai = require('../models/DienThoai');
const jwt = require('jsonwebtoken');
const {mongooseToObject, mutipleMongooseToObject} = require('../../util/mongoose');

class AdminController {
    //GET /admin
    showIndexAdmin(req,res,next){
        res.render('admin/indexAdmin');
    }

    //[GET] /admin/addinfo
    addinfo(req,res,next){
        res.render('admin/addInfo');
    }
    
    //[POST] /admin/added
    added(req,res,next){
        const { name , image, price, Info} = req.body;

        const newDienThoai = new DienThoai({name: name, image: image, price: price, Info: Info});
        newDienThoai.save();
        return res.json({message: 'Thêm thành công'});
    }

    //[GET] /admin/update-phone
    showUpdatePhone(req,res,next){
        DienThoai.find()
            .then(dienthoai => {
                res.render('admin/updatePhone', {
                    dienthoai: mutipleMongooseToObject(dienthoai),
                });
            })
            .catch(next);
    }

    //[GET] /admin/:id/edit
    showUpdatePhoneInfo(req,res,next){
        DienThoai.findOne({_id: req.params.id})
            .then(dienthoai => {
                res.render('admin/updatePhoneInfo', {
                    dienthoai: mongooseToObject(dienthoai),
                });
            })
            .catch(next);
    }

    //[PUT] /admin/:id
    showUpdatePhoneEdit(req,res,next){
        DienThoai.updateOne({_id: req.params.id}, req.body)
        .then(() => {
            res.redirect('/admin/update-phone')
        })
        .catch(next);
    }

    //[GET] /admin/:id/delete
    showUpdatePhoneDelete(req,res,next){
        DienThoai.findOne({_id: req.params.id})
            .then(dienthoai => {
                res.render('admin/deletePhoneInfo', {
                    dienthoai: mongooseToObject(dienthoai),
                });
            })
            .catch(next);
    }

    //[DELETE] /admin/:id/deleted
    showUpdatePhoneDeleted(req,res,next){
        DienThoai.delete({_id: req.params.id})
            .then(() => {
                res.redirect('/admin/update-phone')
            })
            .catch(next);
    }

    //[GET] /admin/users
    showUsers(req,res,next){
        User.find()
            .then(user => {
                res.render('admin/userInfo', {
                    user: mutipleMongooseToObject(user),
                });
            })
            .catch(next);
    }

    //[GET] /admin/users/:id/edit
    showUsersEdit(req,res,next){
        User.findOne({_id: req.params.id})
            .then(user => {
                res.render('admin/userInfoEdit', {
                    user: mongooseToObject(user),
                });
            })
            .catch(next);
    }

    //[GET] /admin/users/:id/delete
    showUsersDelete(req,res,next){
        User.findOne({_id: req.params.id})
            .then(user => {
                res.render('admin/userInfoDelete', {
                    user: mongooseToObject(user),
                });
            })
            .catch(next);
    }

    //[PUT] /admin/users/:id/edited
    showUsersEdited(req,res,next){
        User.updateOne({_id: req.params.id}, req.body)
            .then(() => {
                res.redirect('/admin/users')
            })
            .catch(next);
    }

    //[DELETE] /admin/users/:id/deleted
    showUsersDeleted(req,res,next){
        User.delete({_id: req.params.id})
            .then(() => {
                res.redirect('/admin/users')
            })
            .catch(next);
    }
}
module.exports = new AdminController