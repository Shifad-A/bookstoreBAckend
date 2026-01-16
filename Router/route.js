const express=require('express')


const userContoller=require('../Controllers/userController')
const bookController=require('../Controllers/bookController')
const jwtMiddleware=require('../middleware/jwtMiddleware')
const multerConfig = require('../middleware/multerMiddleware')
const adminMiidleware=require('../middleware/adminMiddleware')

const route =express.Router()

route.post('/api/register',userContoller.userRegister)
route.post('/api/login',userContoller.userLogin)
route.post('/api/google-login',userContoller.googleLogin)
route.post('/api/addbook',jwtMiddleware,multerConfig.array('UploadedImages',3),bookController.addBook)
route.get('/api/getbooks',jwtMiddleware,bookController.getBook)
route.get('/api/getHomeBooks',bookController.getHomeBook)
route.get('/api/viewBook/:id',jwtMiddleware,bookController.viewBook)
route.get('/api/getActiveUser',jwtMiddleware,userContoller.getActiveUser)
route.put('/api/update-user',jwtMiddleware,multerConfig.single('profile'), userContoller.updateUser)
route.put('/api/makePayment',jwtMiddleware,bookController.buyBook)

//Admin side routes
route.get('/api/getUsers',adminMiidleware,userContoller.getUser)
route.get('/api/getAllBooks',adminMiidleware,bookController.getBook)
route.put('/api/update-admin',adminMiidleware,multerConfig.single('profile'), userContoller.updateAdmin)
route.get('/api/getAdmin',adminMiidleware,userContoller.getAdmin)



module.exports=route