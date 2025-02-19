const mongoose = require('mongoose');


const signupDataSchema = new mongoose.Schema({
    email:{type:String,required:false},
    name:{type:String,required:false},
    mobile:{type:Number,required:false},
    password:{type:String,required:false},
    confirmPassword:{type:String,required:false}
});

const signupData = mongoose.model('signup',signupDataSchema);

const userLoadDataSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    from:{type:String,required:false},
    to:{type:String,required:false},
    amount:{type:Number,required:false},
    loadType:{type:String,required:false},
    capacity:{type:String,required:false},
    truckType:{type:String,required:false},
    company:{type:String,required:false},
    pickupLoc:{type:String,required:false},
    dropLoc:{type:String,required:false},
    contactNo:{type:String,required:false},
    alternativeNo:{type:String,required:false},
    userName:{type:String,required:false},
    createdAt: { type: Date, index:{expires:10} }
});

const userLoadData = mongoose.model('LoadDetails',userLoadDataSchema);

module.exports = {signupData,userLoadData};