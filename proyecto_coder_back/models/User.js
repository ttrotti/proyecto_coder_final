import mongoose from 'mongoose';

// USER SCHEMA

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    adress: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    }
})

export const User = mongoose.model('usuarios', userSchema);