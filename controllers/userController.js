require('dotenv').config()
const userModel = require("../model/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_TOKEN = process.env.JWT_TOKEN

const signup = async (request, response) => {
    const userData = request.body
    try {
        const existingUser = await userModel.findOne({ email: userData.email })
        if (existingUser) {
            return response.status(401).send({ message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10)

        const newUser = new userModel({
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        })

        const addedUser = await newUser.save()
        return response.status(201).send(addedUser)

    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const login = async (request, response) => {
    const userData = request.body
    try {
        const validUser = await userModel.findOne({ email: userData.email })
        if (!validUser) {
            return response.status(404).send({ message: "Invalid email" })
        }

        const isPasswordValid = await bcrypt.compare(userData.password, validUser.password)
        if (isPasswordValid) {
            const AUTH_TOKEN = jwt.sign(
                {
                    userId: validUser._id,
                    email: validUser.email,
                },
                JWT_TOKEN
            )
            return response.status(200).send({
                token: AUTH_TOKEN,
                name: validUser.name
            })
        } else {
            return response.status(401).send({ message: "Invalid password" })
        }
    } catch (error) {
        return response.status(500).send({ message: error.message })
    }
}

const home = async (request, response) => {
    try {
        response.status(200).send({
            message: "Welcome, authenticated user!",
            userId: request.userId
        })
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

module.exports = { signup, login, home }
