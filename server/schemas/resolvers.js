// Define the query and mutation functionality to work with the Mongoose models.
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");
// import { GraphQLError } from 'graphql';


const resolvers = {
    Query: {
        users: async () => {

            console.log (`\x1b[33m ┌────────────────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Get all Users  │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └────────────────┘ \x1b[0m\x1b[32m  \x1b[0m`); 

            return User.find()
            //.select("-__v -password")
            // .populate("Book");
        },
        //Find one user based on username or _id
        singleUser: async (parent, args, context) => {    

            console.log (`\x1b[33m ┌────────────────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Find One User  │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └────────────────┘ \x1b[0m\x1b[32m  \x1b[0m`); 

            console.log("context.User", context.User)        
            return User.findOne({                
                $or: [{ username: args.username }, { _id: args.userId }],                
            })
        },

        me: async (parent, args, context) => {

            console.log (`\x1b[33m ┌──────────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Find Me  │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └──────────┘ \x1b[0m\x1b[32m  \x1b[0m`); 

            console.log("context.user Find me", context.user)
            console.log("user._id", context.user._id)

            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                
                // console.log("userData - FindMe ", userData)

                return userData;
            }
            
            throw new AuthenticationError("Not logged in");
        },
    },


    Mutation: {
        createUser : async (parent, args) => {

            console.log (`\x1b[33m ┌──────────────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Create User  │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └──────────────┘ \x1b[0m\x1b[32m  \x1b[0m`); 

            const user = await User.create(args)
            const token = signToken(user)            
            return { token, user }
        },

        // Find user by email or by username
        login : async (parent, args) => {
            
            console.log (`\x1b[33m ┌───────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Login │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └───────┘ \x1b[0m\x1b[32m  \x1b[0m`); 
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

            console.log (`\x1b[33m ┌────────────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Save Book  │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └────────────┘ \x1b[0m\x1b[32m  \x1b[0m`); 
            
            // console.log("context.user", context.user)        
            // console.log("args", args)   

            if (!context.user) {
                throw AuthenticationError("Unauthorised to Save");
            }

            //Lack of context.user info means JWT is absent and will throw an unauthenticated error
            const saveBook = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: args.book } },
                { new: true, runValidators: true }
            );

            return saveBook
        },

        deleteBook: async (parent, {bookId}, context) => {
            
            console.log (`\x1b[33m ┌──────────────┐ \x1b[0m\x1b[32m  \x1b[0m`);
            console.log (`\x1b[33m │ Delete Book  │ \x1b[0m\x1b[32m  \x1b[0m`); 
            console.log (`\x1b[33m └──────────────┘ \x1b[0m\x1b[32m  \x1b[0m`); 

            console.log("context.user", context.user)        
            console.log("args.bookId", bookId)   

            // If not logged in then throw Unauthorised error
            if (!context.user) {
                throw AuthenticationError("Unauthorised to Delete");
            }     
            
            const deleteBook = await User.findOneAndUpdate(
                { _id: context.user._Id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            ).exec()

            console.log (deleteBook)
            if (!deleteBook) {
                console.log("deleteBook Failed")
            }

            return deleteBook;
        },
    }
};

module.exports = resolvers;