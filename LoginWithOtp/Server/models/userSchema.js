import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// const SECRECT_KEY = "abcdefghijklmnop"

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  next();
});

// token generate
// userSchema.methods.generateAuthToken = async function() {
//   try {
//     const newToken = jwt.sign({ _id: this._id }, process.env.SECRECT_KEY, {
//       expiresIn: '1d'
//     });

//     this.tokens.push({ token: newToken });
//     await this.save();

//     return newToken;
//   } catch (error) {
//     throw new Error(error.message);
//   }
// };

// creating model
const users = new mongoose.model("emailotpusers", userSchema);

export default users;
