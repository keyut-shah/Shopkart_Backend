import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
const addressSchema = new mongoose.Schema({
  address_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  addressName: { type: String }, 
  houseNo: { type: String },  
  streetAddress: { type: String }, 
  phone_no: { type: String }, 
  pincode: { type: String },  
  city: { type: String }, 
  state: { type: String },  
  typeOfAddress: { type: String, enum: ['Home', 'Office', 'Other'] }, 
  isSelected: { type: Boolean, default: false },
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
  versionKey: false
});


userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationCode;
  delete user.verificationCodeExpires;
  delete user.isVerified;
  return user;
};


  
userSchema.methods.generateVerificationCode = function() {
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit code
  this.verificationCode = bcrypt.hashSync(code, 10); // Encrypt the code before saving
  this.verificationCodeExpires = Date.now() + 3600000; // Code expires in 1 hour
  return code;
};

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
