export default function PostDetails(request, response, next) {
  const { title } = request.body;
  const { content } = request.body;

  if (!title || !content) {
    return response.status(422).json({
      error: 'Please fill out all required fields',
    });
  }
  next();
}
