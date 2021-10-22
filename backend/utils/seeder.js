const Product = require('../modals/product');

const dotenv=require('dotenv');
const ConnectDatabase = require('../config/datadase');
const products=require('../data/products.json')

dotenv.config({path:'backend/config/info.env'})

ConnectDatabase()

const seedProducts=async(req,res,next)=>{
    try {
        await Product.deleteMany()
        console.log("Products are deleted successfully")

        await Product.insertMany(products)
        console.log("Products are inserted successfully")
        process.exit()
    } catch (error) {
        console.log(error)
    }
}

seedProducts()