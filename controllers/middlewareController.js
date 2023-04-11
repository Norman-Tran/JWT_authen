const jwt = require("jsonwebtoken");
const { use } = require("../routes/auth");

const middlewareController = {
    //verifyToken
    verifyToken: (req, res, next) => {
        const token = req.headers.token;
        if(token){
            const accessToken = token.split(" ")[1]; //TAKE FIRST VALUE IN HEADER OF TOKEN AFTER " "
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY,(err, user)=> {
                if(err) {
                    res.status(403).json("Token invalid");
                }
                req.user = user;
                next();
            });
        }
        else {
            res.status(401).json("You are not allowed to access this");
        }
    },

    verifyTokenAndAdmin: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if(req.user.id == req.params.id || req.user.admin) {
                next();
            }
            else {
                res.status(403).json("You are not allowed to delete other users");
            }
        });
    },
};

module.exports = middlewareController;