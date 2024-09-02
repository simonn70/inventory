import { Schema, Types, model, models } from "mongoose";



const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: false  },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'partner', 'admin'], required: true },
    phone: { type: String, required: true },
    verificationCode: { type: String, required: false },
     isVerified: { type: Boolean, required:false },
    resetPasswordExpires: { type: Date },
    address: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    savedAddresses: [{
        type: Schema.Types.ObjectId,
        ref: 'Address'
    }],
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location'
    },
    profileImage: { type: String },
    notifications: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service'
    }],
    chat: [{
        type: Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// const User = mongoose.model('User', userSchema);
// module.exports = User;


const User = models.User || model("User", userSchema)
export default User