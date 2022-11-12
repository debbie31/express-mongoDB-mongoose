import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import process from 'node:process';
import AuthorExist from './middleware/AuthorExist.js';
import EmailExist from './middleware/EmailExist.js';
import LoginDetails from './middleware/LoginDetails.js';
import PostDetails from './middleware/PostDetails.js';
import UserExist from './middleware/UserExist.js';
import ValidEmail from './middleware/ValidEmail.js';
import Post from './models/Post.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.URI);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
app.set('port', PORT);

app.use(express.json());

app.get('/', (request, response) => {
  response.status(200).json({
    message: 'Welcome to Uplift!',
  });
});

app.get('/users', async (request, response) => {
  response.status(200).json(await User.find());
});

app.post(
  '/users',
  [LoginDetails, EmailExist, ValidEmail],
  async (request, response) => {
    const newUser = new User({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: request.body.password,
    });

    const result = await newUser.save();
    response.status(201).json(result);
  }
);

app.post('/posts/:id', [UserExist, PostDetails], async (request, response) => {
  const newPost = new Post({
    title: request.body.title,
    content: request.body.content,
    authorId: request.header('X-USER-ID'),
  });

  const post = await newPost.save();
  response.status(201).json(post);
});

app.get("/users/:userId/posts", AuthorExist, async (request, response) => {
  const { userId } = request.params;
  const { limit, offset } = request.query;

  response
    .status(200)
    .json(
      await Post.aggregate([
        { $match: { authorId: mongoose.Types.ObjectId(userId) } },
        { $sort: { date: -1 } },
        { $limit: parseInt(limit) || 20 },
        { $skip: parseInt(offset) || 0 },
      ])
    );
});

app.delete('/posts/:postId', async (request, response) => {
  const { postId } = request.params;

  await Post.updateOne(
    {
      _id: postId,
    },
    {
      deletedAt: Date.now(),
    }
  );

  response.status(200).json({
    message: 'Successfully removed post',
  });
});

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
