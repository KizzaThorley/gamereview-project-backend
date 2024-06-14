import mongoose, { Mongoose } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";
import mongooseHidden from "mongoose-hidden"
import bcrypt from "bcrypt"

const hidden = mongooseHidden({ defaultHidden: {password: true} })
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const match = [emailRegex, "Your email address must contain '@'"]

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, minLength: [5, "Username must be at least 5 characters long."], maxLength: [25, "Username cannot be longer than 25 characters."], unique: [true, "The username {VALUE} is taken."], trim: true},
    email: {type: String, required: true, unique: true, match: match, trim: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false}
})

userSchema.pre('save', function(next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    next()
})

userSchema.plugin(mongooseUniqueValidator)
userSchema.plugin(hidden)

export default mongoose.model("User", userSchema)