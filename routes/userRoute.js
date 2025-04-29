const express = require("express")
const { signup, login, home } = require("../controllers/userController")
const verifyToken = require("../middleware/verifyUser")

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/home', verifyToken, home)

module.exports = router
