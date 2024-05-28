const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosedelete = require('mongoose-delete');

const GioHangSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref:'User'},
    name: {type: String},
    image: {type: String},
    price: {type: Number},
    quantity: {type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    Info: {type: String},
})

GioHangSchema.plugin(mongoosedelete, {deletedAt: true, overrideMethods: true});

module.exports = mongoose.model('GioHang', GioHangSchema);