const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosedelete = require('mongoose-delete');

const UserSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    sdt: {type: Number},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role: {type: String},
})

UserSchema.plugin(mongoosedelete, {deletedAt: true, overrideMethods: true});

module.exports = mongoose.model('User', UserSchema);