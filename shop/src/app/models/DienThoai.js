const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosedelete = require('mongoose-delete');

const DienThoaiSchema = new Schema({
    name: {type: String},
    image: {type: String},
    price: {type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    Info: {type: String},
})

DienThoaiSchema.plugin(mongoosedelete, {deletedAt: true, overrideMethods: true});

module.exports = mongoose.model('DienThoai', DienThoaiSchema);