const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,//obligatorio
        trim:true,//elimina espacios antes y despues
        unique:true,//no repetitivo
        lowercase:true//solo minuscula
    },
    name:{
        type:String,
        required:true,//obligatorio
        trim:true,//elimina espacios antes y despues
    },    
    password:{
        type:String,
        required:true,
        minlength:8,
        trim:true,
        validate(){
            if(this.password=="12345678"){
                throw new Error("La contraseña no puede ser 12345678")
            }
        }
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        },
        
    ]
})

userSchema.methods.hashPassword = async function(){
    this.password = await bcrypt.hash(this.password,5)
}

userSchema.methods.verifyPassword = async function(password){
    const isEqual = await bcrypt.compare(password,this.password)
    return isEqual;
}

userSchema.methods.generateToken = function(){

    const token = jwt.sign({_id:this.name.toString()},process.env.AUTH_PASSWORD)
    this.tokens = [{token}]
    this.save()
    return token;
}

const User = mongoose.model("User", userSchema)
module.exports=User