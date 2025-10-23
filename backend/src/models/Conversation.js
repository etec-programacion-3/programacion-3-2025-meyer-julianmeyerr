import mongoose from "mongoose";
const { Schema, Types} = mongoose;

const conversationSchema = new Schema({
  members: [{ type: Types.ObjectId, ref: 'User' }],
  productId : { type: Types.ObjectId, ref: 'Product'},
});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;