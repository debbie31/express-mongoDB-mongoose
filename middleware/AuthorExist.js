import User from '../models/User.js';

export default async function AuthorExist(request, response, next) {
  const { userId } = request.params;
  
  const authorExist = await User.findOne({ _id: userId });

  if (!authorExist) {
    return response.status(422).json({
      error: 'Author does not exist',
    });
  }
  next();
}
