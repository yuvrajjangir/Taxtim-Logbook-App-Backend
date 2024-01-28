const express = require('express');
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
const {UserModel} = require("../model/authmodel");
const bcrypt = require("bcryptjs");

UserRouter.post("/signup", (req, res) => {
    const {name, email, password} = req.body;
    bcrypt.hash(password, 10, async function(err, hash){
        if(err){
            res.send(err);
        }
        const user = new UserModel({
            name,
            email,
            password: hash,
        })
        try {
            await user.save();
            res.send("Singup successful");
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    });
})

UserRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }
        const hash = user.password;

        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                return res.status(500).send(err);
            }
            if (result) {
                const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
                return res.send({ message: "Login successful", token: token });
            } else {
                return res.status(401).send("Wrong password");
            }
        });
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

module.exports = {UserRouter};