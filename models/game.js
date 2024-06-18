import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";


const numberMessage = "number needs be between 1 and 5"

const reviewSchema = new mongoose.Schema({

    review: { type: String, required: true, trim: true, },
    rating: { type: Number, required: true, min: [1, numberMessage], max: [5, numberMessage] },
    addedBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true, },
},
    { timestamps: true })

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: [true, "game needs to be unique"] },
    year: { type: Number, required: true, min: [1958, "Your game cant be older than the first game ever"], trim: true },
    genres: [{ type: mongoose.Schema.ObjectId, required: true, ref: "Genre" }],
    imageUrl: { type: String, required: false, trim: true },
    addedBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true, },
    reviews: [reviewSchema],
})


gameSchema.plugin(mongooseUniqueValidator)



export default mongoose.model('Game', gameSchema)
