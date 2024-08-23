import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const addressSchema = new mongoose.Schema({
  addressName: { type: String }, 
  houseNo: { type: String },  
  streetAddress: { type: String }, 
  phoneNo: { type: String }, 
  pincode: { type: String },  
  city: { type: String }, 
  state: { type: String },  
  typeOfAddress: { type: String, enum: ['Home', 'Office', 'Other'] }, // 
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
  gender: { type: String, enum: ['Male', 'Female', 'Other'] }, 
  phoneNo: { type: String }, 
  addresses: [addressSchema], 
  profilePicture: { type: String },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
  },
  verificationCodeExpires: {
    type: Date,
  },

}, {
  timestamps: true,
});

  
  

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  userSchema.methods.isPasswordCorrect = async function(password){
    console.log("inside the password correct function check")
    return await bcrypt.compare(password, this.password)
  }
  

const User = mongoose.model('User', userSchema);

export default User;
