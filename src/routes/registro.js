import { Router } from "express";
import { getUser, deleteUser, createUserRegister, loginUsers} from "../controllers/register.controller.js"

const router = Router()

router.get('/register', getUser)
router.post('/register', createUserRegister)
router.post('/login', loginUsers)
router.delete('/register/:id', deleteUser)

export default router;


