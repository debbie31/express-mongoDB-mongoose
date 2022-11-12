import User from '../models/User.js';

export default async function EmailExist(request, response, next) {
  const { email } = request.body;

  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return response.status(422).json({ error: 'Email already exists' });
  }
  next();
}
