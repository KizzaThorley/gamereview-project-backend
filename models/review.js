import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const numberMessage = "number needs be between 1 and 5"

const reviewSchema = new mongoose.Schema({

    review: { type: String, required: true, trim: true, },
    rating: { type: Number, required: true, min: [1, numberMessage], max: [5, numberMessage] },
    addedBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true, },

})

reviewSchema.plugin(mongooseUniqueValidator)

export default mongoose.model("Review", reviewSchema)