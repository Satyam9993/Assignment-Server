const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt  = require("bcryptjs");
const jwt = require('jsonwebtoken')
require('dotenv').config();

const vendorSchema = new Schema({
    name: {
        type: String,
        required : [true, "name is required"],
    },
    email : {
        type : String,
        unique : true,
        required : [true, "email is required"],
        validate : {
            validator : function(value){
                var regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
                return regex.test(value);
            },
            message : "Please write correct email"
        }
    },
    password : {
        type: String,
        select : false,
        minlength : [6, "Password should be minimum of length 6"],
    },
    role: {
        type : String,
        default : "Vendor"
    },
},{ timestamps: true });

// Sign Access Token
vendorSchema.methods.SignAccessToken = async function(){
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '');
}

// Hash Password
vendorSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Compare Password
vendorSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const VendorModel = mongoose.model('Vendor', vendorSchema);
module.exports = VendorModel;