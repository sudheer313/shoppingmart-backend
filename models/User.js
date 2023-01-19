const { model, Schema } = require("mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: true,
    },
    email: {
      type: String,

      
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      //required: [true, "password is required"],
    },
    fromGoogle: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
