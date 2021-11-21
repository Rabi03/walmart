const express=require('express');
const Products=require('./routes/Product')
const User=require('./routes/User')
const Order=require('./routes/Order')
const Payment=require('./routes/Payment')
const dotenv=require('dotenv');
const cookieParser= require('cookie-parser')
const bodyParser= require('body-parser')
const cloudinary=require('cloudinary')
const fileUpload=require('express-fileupload')
const path=require('path')


process.on('uncaughtException', err=>{
    console.log(err.stack)
    console.log('Server is sutting down due to uncaught exception')
    process.exit(1)
})

const ConnectDatabase = require('./config/datadase');
const errorMiddleware = require('./middleware/error');

dotenv.config({path:'backend/config/info.env'})

const app=express();
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

app.use('/api/v1',Products)
app.use('/api/v1',User)
app.use('/api/v1',Order)
app.use('/api/v1',Payment)

if(process.env.NODE_ENV === 'PRODUCTION'){
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*',(req, res) =>{
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET, 
  });

app.use(errorMiddleware)
ConnectDatabase();

const server=app.listen(5000,()=>console.log(`Server is running on Port: 5000`))

process.on('unhandledRejection',err=>{
    console.log(err)
    console.log('Server is sutting down due to unhandled rejection')
    server.close(()=>process.exit(1))
})