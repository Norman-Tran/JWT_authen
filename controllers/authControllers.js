const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authController = {
    //REGISTER
    registerUser: async(req, res) => {
        try {
           // const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, 10);

            //CREATE NEW USER
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
                admin: req.body.admin
            });

            console.log(newUser);

            //SAVE USER TO DB
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            res.status(500).json(err.message);
        }
    },

    //GENERATE ACCESS TOKEN
    generateAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin,                    
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "60s"}
        )
    },

    //GENERATE REFRESH TOKEN
    generateRefreshToken:(user)=>{
        return jwt.sign({
            id: user.id,
            admin: user.admin,                    
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "1d"}
        )
    },

    //LOGIN
    loginUser: async(req, res) => {
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if(!validPassword){
                res.status(404).json("Wrong password!");
            }
            if(user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, //set true for deploy
                    path:"/",
                    sameSite: "strict",
                })
                const {password, ...others} = user._doc; // FOR NOT RETURNING USER'S PASSWORD    
                res.status(200).json({...others, accessToken, refreshToken}); // RETURN USER AND ACCESS_TOKEN
            }
        }catch(err){
            res.status(500).json(err.message);
        }
    },

    requestRefreshToken: async(req,res) => {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json("You are not authenticated");
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if(err){
                console.log(err);
            }
            //Create new access token and refresh token
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false, //set true for deploy
                path:"/",
                sameSite: "strict",
            });
            res.status(200).json({accessToken: newAccessToken});
        })
    }
};

module.exports = authController;