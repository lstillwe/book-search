const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
        getSingleUser: async (parent, { user, params }) => {
            return User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        }
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
      
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                ).populate('savedBooks');
      
              return updatedUser;
            }
      
            throw new AuthenticationError('You need to be logged in!');
        },
        deleteBook: async (parent, { bookId }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
                { new: true }
                );
                if (!updatedUser) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
                }

                return (updatedUser);
            }
            
            throw new AuthenticationError('You need to be logged in!');
        }
    }
}