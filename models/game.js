import mongoose, { Mongoose } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import reviewSchema from "./review";


const gameSchema = new mongoose.Schema({
name: {type: String, required: true, trim: true, unique: [true, "game needs to be unique"]},
year: {type: Number, required: true, min: [1958, "Your game cant be older than the first game ever"], trim: true},
genre: {type: String, required: true, trim: true},
imageUrl: {type: String, required: false, trim: true},
addedBy: {type: mongoose.Schema.ObjectId, ref: "User", required: true, },
reviews: [reviewSchema],
})

gameSchema.plugin(mongooseUniqueValidator)

export default mongoose.model('Game', gameSchema)