const express = require('express')
const User = require('../models/user')

const router = new express.Router()

router.post("/user/register", async (req,res)=>{
    try{
    const reques = req.body
    const user = await User.create(
        {
            email:reques.email,
            name:reques.name,
            password:reques.password
        }
    ).catch((error)=>{
        console.log("Error duplicado;",error)
        throw new Error("Existing user")
    })

    await user.hashPassword()
    await user.save()
    const token = await user.generateToken()
    console.log(token)
    res.status(200).send(    {
        data:{token},
        status:true,
        message:"User created"
      })

    }catch(error){
        console.log(error);
        res.status(200).send(    {
            data:{error:error.toString()},
            status:false,
            message:"Error" 
        })
    }
})

router.post("/user/login",async(req,res)=>{
    try{
        const request = req.body
        const user = await User.findOne({
            email:request.email
        }).catch((error)=>{
            console.log("Login Failed",error)
            throw new Error("Existing user or incompleted params")
        })
        if (user==null){

            throw new Error("User not found")
            
            
        }
        const match = await user.verifyPassword(request.password)
        if(match==false){
            throw new Error("Incorrect Password")
        }
        const token = await user.generateToken()
        res.status(200).send(    {
            data:{token},
            status:true,
            message:"Correct Verify" 
        }) 

    }catch(error){
        console.log(error);
        res.status(200).send(    {
            data:{error:error.toString()},
            status:false,
            message:"Error" 
        })
    }
})
module.exports = router