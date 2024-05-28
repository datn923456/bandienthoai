const User = require('../models/User');
const DienThoai = require('../models/DienThoai');
const jwt = require('jsonwebtoken');
const GioHang = require('../models/GioHang');
const {mongooseToObject, mutipleMongooseToObject} = require('../../util/mongoose');

class UserController {
    //GET /register
    register(req,res,next){
        res.render('indexChung/register');
    }

    //POST /created
    created(req,res,next){
        const { username, password, email, sdt} = req.body;
        const findUserByUsername = User.findOne({username : username});
        const findUserByEmail = User.findOne({email : email});
        
        Promise.all([findUserByUsername , findUserByEmail])
            .then(([userByUsername,userByEmail]) =>{
                if(userByUsername){
                    return res.json({message: 'Username đã tồn tại'})
                }else if(userByEmail){
                    return res.json({message: 'Email đã được đăng ký'});
                }else if(!userByUsername && !userByEmail){
                    const newUser = new User({username: username, password: password, email: email, sdt: sdt, role: "user"});
                    newUser.save();
                    return res.json({message: 'Đăng ký thành công'});
                }
            })
            .catch(error =>{
                return res.status(500).json({message: 'Đã xảy ra lỗi'});
            });
    }
    
    //[GET] /login
    login(req,res,next){
        res.render('indexChung/login');
        
    }

    //[POST] /logined
    logined(req,res,next){
        const { username , password} = req.body;
        console.log(username,password);
        const findUserByUsername = User.findOne({username : username});
        const findUserByPassword = User.findOne({password : password});
        
        Promise.all([findUserByUsername , findUserByPassword])
            .then(([userByUsername,userByPassword]) =>{
                if(userByUsername && userByPassword){
                    const token = jwt.sign({_id: userByUsername._id}, 'mk');
                    return res.json({message: userByUsername.role, token: token})
                }else if(userByUsername && !userByPassword){
                    return res.json({message: 'Sai mật khẩu'});
                }else{
                    return res.json({message: 'Tài khoản không tồn tại'});
                }
            })
            .catch(error =>{
                return res.status(500).json({message: 'Đã xảy ra lỗi'});
            });
    }

    //[GET] /home
    showIndexUser(req,res,next){
        var token = req.cookies.token;
        if (token) {
            try {
                var decodeToken = jwt.verify(token, 'mk');
                User.findOne({ _id: decodeToken._id })
                    .then(userInfo => {
                        DienThoai.find({})
                            .then(dienthoai =>{
                                res.render('Client/indexClient', {
                                    userInfo: mongooseToObject(userInfo),
                                    dienthoai: mutipleMongooseToObject(dienthoai),
                                });
                            }).catch(next);
                    })
                    .catch(next);
            } catch (err) {
                res.redirect('/login'); 
            }
        } else {
            res.redirect('/login');
        }
    }

    //[GET] /home/:id
    showInfoPhone(req,res,next){
        var token = req.cookies.token;
        const id = req.params.id;
        if (token) { // Kiểm tra xem có token không
            try {
                var decodeToken = jwt.verify(token, 'mk');
                DienThoai.findOne({ _id: id })
                    .then(dienthoai => {
                        res.render('Client/infoPhone', {
                            dienthoai: mongooseToObject(dienthoai),
                        });
                    })
                    .catch(next);
            } catch (err) {
                res.redirect('/login'); 
            }
        } else {
            res.redirect('/login');
        }
    }

    //[POST] /order/:id
    addPhoneGioHang(req,res,next){
        var token = req.cookies.token;
        const quantity = req.body.quantity;
        const id = req.params.id;
        console.log(quantity);
        if (token) { // Kiểm tra xem có token không
            try {
                var decodeToken = jwt.verify(token, 'mk');
                DienThoai.findOne({_id: id})
                    .then(dienthoai =>{
                        GioHang.find({userId: decodeToken._id})
                            .then(giohang =>{
                                const array = giohang.map(product =>{
                                    if(product.name === dienthoai.name){
                                        return product;
                                    }
                                });
                                console.log(array);
                                const arr = [];
                                const xoaArray = array.filter(product => product !== undefined);
                                if(JSON.stringify(arr) !== JSON.stringify(xoaArray))
                                {
                                    const a = xoaArray[0]._id.toHexString();
                                    GioHang.findOneAndUpdate({_id: a}, {$inc: {quantity: quantity}})
                                        .then(() =>{
                                            return res.json({message: 'Cập nhật thành công'});
                                        })
                                        .catch(next)
                                }else if(JSON.stringify(arr) === JSON.stringify(xoaArray))
                                {
                                    const newOrder = new GioHang({userId: decodeToken._id, name: dienthoai.name, image: dienthoai.image, price: dienthoai.price, Info: dienthoai.Info, quantity: quantity});
                                    newOrder.save();
                                    return res.json({message: 'Thêm thành công'});
                                }

                            })
                            .catch(next)
                    })
                    .catch(next)
            } catch (err) {
                res.redirect('/login'); 
            }
        } else {
            res.redirect('/login');
        }
    }

    //[GET] /order
    showOrder(req,res,next){
        var token = req.cookies.token;
        if (token) {
            try {
                var decodeToken = jwt.verify(token, 'mk');
                    GioHang.find({userId: decodeToken._id})
                        .then(giohang =>{
                            const array = giohang.map(product =>{
                                return product.price * product.quantity;
                            });
                            const tong = array.reduce((total,value) => total + value, 0);

                            res.render('Client/order', {
                                giohang: mutipleMongooseToObject(giohang),
                                tong: tong,
                            });
                        }).catch(next);
            } catch (err) {
                res.redirect('/login'); 
            }
        } else {
            res.redirect('/login');
        }
    }

    //[POST] /update-order/:id
    updateOrder(req,res,next){
        var token = req.cookies.token;
        const quantity = req.body.quantity;
        const id = req.params.id;
        console.log(quantity)
        if (token) {
            try {
                var decodeToken = jwt.verify(token, 'mk');
                GioHang.updateOne({ _id: id } , {quantity: quantity})
                    .then(() => {
                        return res.json({message: 'Cập nhật thành công'})
                    })
                    .catch(next);
            } catch (err) {
                res.redirect('/login'); 
            }
        } else {
            res.redirect('/login');
        }
    }

    //[DELETE] /delete-order/:id
    deleteOrder(req,res,next){
        var token = req.cookies.token;
        const id = req.params.id;
        console.log(id);
        if (token) {
            try {
                var decodeToken = jwt.verify(token, 'mk');
                GioHang.deleteOne({ _id: id })
                    .then(() => {
                        return res.json({message: 'Xóa thành công'})
                    })
                    .catch(next);
            } catch (err) {
                res.redirect('/login'); 
            }
        } else {
            res.redirect('/login');
        }
    }
}
module.exports = new UserController