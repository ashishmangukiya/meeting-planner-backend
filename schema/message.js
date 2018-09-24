const mongoose=require('mongoose');
const time = require('../libs/timeLib')

const schema=mongoose.Schema;

let messageSchema=new schema({
    messageId:{
        type:String,
        default:'',
        index:true,
        unique:true
    },
    title:{
        type:String,
        default:'',
    },
    userId:{
        type:String,
        default:'',
    },
    userName:{
        type:String,
        default:'',
    },
    alert:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        default:'',
    },
    userEmailId:{
        type:String,
        default:'',
    },
    adminId:{
        type:String,
        default:'',
    },
    adminName:{
        type:String,
        default:'',
    },
  
    start: {
        type:String,
        default:time.now(),
    },
    end:{
        type:String,
        default:time.now(),
    },
    color:{primary:{
            type:String,
            default:''},
           secondary:{
            type:String,
            default:''}
    },
    draggable:{
        type:Boolean,
        default:false
    },
    resizable: { beforeStart:{ type:Boolean,default:false}, afterEnd:{ type:Boolean,default:false} },
})



mongoose.model('messageSchema',messageSchema)