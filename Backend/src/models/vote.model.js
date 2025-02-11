import mongoose , {Schema} from "mongoose";

const voteSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    votedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    voteType: { 
        type: String,
        enum: ['up', 'down'],
        required: true
    },
}, { timestamps: true });

export const Vote = mongoose.model("Vote" , voteSchema)