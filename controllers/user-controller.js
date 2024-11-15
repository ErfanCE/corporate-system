const User = require('../models/user-model');
const { AppError } = require('../utils/app-error');

// const getAllUsers = async (request, response, next) => {
//   try {
//     const users = await User.find({});

//     response.status(200).json({
//       status: 'success',
//       data: { users }
//     });
//   } catch (err) {
//     next(new AppError(500, err.message));
//   }
// };

const addUser = async (request, response, next) => {
  try {
    const user = new User(request.body);
    await user.save(); // throw error

    console.info(`user (id:${user._id}}) added successfully.`);

    response.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};

module.exports = { addUser };
