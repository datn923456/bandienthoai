//const User = require('../models/User');

class NewsController {
    index(req,res,next){
        res.render('indexChung/giaoDienChung');
    }
    showIndex(req,res,next){
        res.render('indexChung/abc');
    }
}
module.exports = new NewsController