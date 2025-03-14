import mongoose from "mongoose";

const TrashSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  blogText: {
    type: String,
  },
  image: {
    type: String, 
  },
  voiceMail: {
    type: String, 
  },
  pdf: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model("Trash", TrashSchema);