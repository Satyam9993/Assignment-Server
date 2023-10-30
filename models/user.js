const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt  = require("bcryptjs");
const jwt = require('jsonwebtoken')
require('dotenv').config();

const userSchema = new Schema({
    name: {
        type: String,
        require : [true, "name is required"],
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
        default : "user"
    },
    isVarified : {
        type : Boolean,
        default : false
    },
    vendors : [{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'   
    }],
    orders : [{
        type: Schema.Types.ObjectId,
        ref: 'Order'   
    }],
}, { timestamps: true });

// Sign Access Token
userSchema.methods.SignAccessToken = async function(){
    return jwt.sign({id: this._id}, process.env.ACCESS_TOKEN || '');
}

// Hash Password
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;