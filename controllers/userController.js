const User = require("../models/Users");

const userController = {
    //GET ALL USERS
    getAllUsers: async (req, res) => {
        try {
            const user = await User.find();
            res.status(200).json(user);
        }catch(err) {
            res.status(500).json(err);
        }
    },

    //DELETE USER
    deleteUser: async (req, res) => {
        try{
            //change to findByIdAndDelete(req.params.id) to delete user for deploy
            const user = await User.findById(req.params.id); //fake delete user function
            res.status(200).json("Delete successfully!");
        }catch(err) {
            res.status(500).json(err);
        }
    }
}

module.exports = userController;