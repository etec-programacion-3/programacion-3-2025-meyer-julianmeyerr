import mongoose from "mongoose";
const { Schema, Types} = mongoose;

const conversationSchema = new Schema({
  members: [{ type: Types.ObjectId, ref: 'User' }]
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;