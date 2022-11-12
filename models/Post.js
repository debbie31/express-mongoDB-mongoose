import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  authorId: Types.ObjectId,
  date: {
    type: Date,
    default: Date.now,
  },
});

export default model('Post', postSchema);
