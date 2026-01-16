require('dotenv').config()

const express =require('express')
const cors =require('cors')
require('./config/db')
const route =require('./Router/route')
const appMiddleware = require('./middleware/appMiddleware')

const bookstoreServer=express()
bookstoreServer.use(cors())
bookstoreServer.use(express.json())
bookstoreServer.use(appMiddleware)
bookstoreServer.use(route)
bookstoreServer.use('/uploads',express.static('./uploads'))

const PORT =process.env.PORT || 3000
console.log(PORT);


bookstoreServer.get('/',(req,res)=>{
    res.send(`welcome to bookstore backend`);
})


bookstoreServer.listen(PORT,()=>{
    console.log(`Bookstore server running on the port ${PORT}`);
})
