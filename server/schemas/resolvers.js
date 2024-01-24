// Define the query and mutation functionality to work with the Mongoose models.
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        users: async () => {
            return User.find().select("-__v -password").populate("book");
        },
        
        singleUser: async (parent, args) => {
            console.log (args)
            return User.findOne({
                $or: [{ username: args.username }, {_id: args.userId}],
            });
            
            
            //console.log (user)
        
            // if (!foundUser) {
            //     return res.status(400).json({ message: 'Cannot find a user with this id!' });
            // }
        
            // return(user)

        }

        // getSingleUser: async (parent, { username }) => {
        //     return User.findOne({ username })
        //         .select("-__v -password")
        //         .populate("book");
        // },
    },


    Mutation: {
        createUser : async (parent, {args}) => {
            return User.create({args})

        }
    }

};

module.exports = resolvers;