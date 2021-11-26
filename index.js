const express = require("express")
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4001
const userRouter = require("./src/user/index")

require("dotenv").config()
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URL)

app.use(express.json())
app.use(cors())
app.use(userRouter)

app.listen(port,()=>{
    console.log("server init on port "+port)
})