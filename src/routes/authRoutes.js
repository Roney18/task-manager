const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();


//Register
router.post("/register", async(req, res)=> {
    const{ name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if(user) return res.status(400).json({message: "User already exist"});

        const hashedPassword = await bcrypt.hash(password,10);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({message : "User registered"});
    } catch ( error){
        res.status(500).json({error: error.message});
    }
});

//Login
router.post("/login", async(req, res)=> {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if(!user) return res.status(400).json({message: "Invalid user"});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({message: "Invalid password"});

        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: "Id"}
        );

        res.json({token});
    }catch(error){
        res.status(500).json({message: error.message});
    }
});

module.exports = router;