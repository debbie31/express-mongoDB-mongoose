import User from '../models/User.js';

export default async function UserExist(request, response, next) {
  const { id } = request.params;
  const userExist = await User.findOne({ _id: id });

  if (!userExist) {
    return response.status(422).json({
      error: 'User is required',
    });
  }
  next();
}
