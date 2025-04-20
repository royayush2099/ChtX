import express from 'express'
const router = express.Router()
import { signup,login,logout,updateProfile,checkAuth } from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'


router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)
router.put("/update-profile",protectRoute,updateProfile)//adding the middleware to check user is authenticated
router.get("/check",protectRoute,checkAuth)//check is user is authenticated or not

export default router;