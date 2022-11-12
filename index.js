import * as dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import process from 'node:process';
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

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
