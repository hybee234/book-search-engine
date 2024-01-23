// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    singleUser: async (parent, args, context) => {
      return await User.find();


      // class: async (parent, args, context) => {
      //   return await Class.findById (args.id).populate('professor')
      // },
    },
  }
};

module.export =resolvers;

    