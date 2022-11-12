export default function LoginDetails(request, response, next) {
  const { firstName } = request.body;
  const { lastName } = request.body;
  const { email } = request.body;
  const { password } = request.body;

  if (!firstName || !lastName || !email || !password) {
    return response.status(422).json({
      error: 'Please fill out all required fields',
    });
  }
  next();
}
