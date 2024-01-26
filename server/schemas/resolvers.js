// Define the query and mutation functionality to work with the Mongoose models.
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
// import { GraphQLError } from 'graphql';


const resolvers = {
    Query: {
        users: async () => {
            return User.find()
            //.select("-__v -password")
            // .populate("Book");
        },
        //Find one user based on username or _id
        singleUser: async (parent, args) => {            
            return User.findOne({                
                $or: [{ username: args.username }, { _id: args.userId }],                
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
        createUser : async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)            
            return { token, user }
        },

        // Find user by email or by username
        login : async (parent, args) => {
            //Check User
            const user = await User.findOne({                
                $or: [{ username: args.username }, { email: args.email }],                
            });
            // console.log ("user", user)
            if (!user) {
                throw AuthenticationError;
            }
            // Check Password
            const correctPw = await user.isCorrectPassword(args.password);
            if (!correctPw) {
                throw AuthenticationError;
            }
            const token = signToken(user)            
            return { token, user }
        },

        // Save book under user profile
        saveBook: async (parent, args, context) => {
            // console.log(args)
            console.log(context.User)
            const saveBook = await User.findOneAndUpdate(
                { _id: args.userId },
                { $addToSet: { savedBooks: args.book } },
                { new: true, runValidators: true }
            );

            // console.log(saveBook)
            // // If user attempts to execute this mutation and isn't logged in, throw an error
            // throw AuthenticationError;

            // TODO - make sure user is logged in - or is this route only available when logged in?

            return saveBook
        },

        deleteBook: async (parent, args, context) => {
            console.log(args)
            const updatedUser = await User.findOneAndUpdate(
                { _id: args.userId },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );

            // TODO - make sure user is logged in - or is this route only available when logged in?

            return updatedUser;
        },
    }

};

module.exports = resolvers;