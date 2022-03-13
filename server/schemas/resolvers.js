const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    // Query: {
    //     user: async (parent, { username }) => {
    //         const params = username ? { username } : {};
    //         return User.find(params).sort({ createdAt: -1 });
    //     },
    // }
    Query: {
        getSingleUser: async (parent, { user, params }) => {
            return User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
            });
        },
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

        saveBook: async (parent, { bookId }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: bookId } },
                { new: true }
              ).populate('savedBooks');
      
              return updatedUser;
            }
      
            throw new AuthenticationError('You need to be logged in!');
        },

        deleteBook: async (parent, { bookId }, context) => {
            const updatedUser = await User.findOneAndUpdate(
              { _id: context.user._id },
              { $pull: { savedBooks: { bookId: params.bookId } } },
              { new: true }
            );
            if (!updatedUser) {
              return res.status(404).json({ message: "Couldn't find user with this id!" });
            }
            return res.json(updatedUser);
          },
    }
}