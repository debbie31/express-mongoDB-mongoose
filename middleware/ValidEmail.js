export default async function ValidEmail(request, response, next) {
  const { email } = request.body;
  const symbol = await email.indexOf('@');
  if (symbol < 1) {
    return response.status(422).json({
      error: 'Email is incorrect',
    });
  }
  next();
}
