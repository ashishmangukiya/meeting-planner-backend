const mongoose=require('mongoose');

let schema= mongoose.Schema;

let userSchema=new schema(
    {
        userId:{
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
        accountVerification:{
            type:String,
            default:''
        },
        country:{
            type:String,
            default:''
        },
        email:{
            type:String,
            default:''
        },
        mobileNumber:{
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
}
)

mongoose.model('userSchema',userSchema);