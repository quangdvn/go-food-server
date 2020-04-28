const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    require: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    trim: true,
    require: true,
    validate(value) {
      if (value.length < 6) {
        throw new Error("Password is too short");
      }
    },
  },
  name: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
    unique: true,
  },
  tokens: [
    {
      token: {
        type: String,
        require: true,
      },
    },
  ],
});

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() },"thisisnewtoken")
    user.tokens = user.tokens.concat({token})

    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email : email})
    if(!user){
        return undefined
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        return undefined  
    }

    return user
}

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (user.isModified("password")) {
      const password = await bcrypt.hash(user.password, 10);
      user.password = password;
    }

    next();
  } catch (error) {
    console.log(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
