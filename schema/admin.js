const mongoose = require('mongoose')
const Schema = mongoose.Schema

let adminSchema=new Schema({

    adminId:{
        type:String,
        default:''
    },
    userName:{
        type:String,
        default:''
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    activated:{
        type:Boolean,
        default:false
    },
    country:{
        type:String,
        default:''
    },
    accountVerification:{
        type:String,
        default:''
    },
    mobileNumber:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    recoveryPassword:{
        type:String,
        default:''
    }
})
mongoose.model('adminSchema',adminSchema);