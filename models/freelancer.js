const Joi = require('joi');
const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        maxlength: 20,
        unique: true
    },
    skill: {
        type: String,
        required: true,
        maxlength: 50
    },
    hobby: {
        type: String,
        required: true,
        maxlength: 50
    }
});

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

function validateFreelancer(freelancer) {
    const schema = {
        user: Joi.objectId(),
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().max(20).required(),
        skill: Joi.string().max(50).required(),
        hobby: Joi.string().max(50).required(),
    };

    return Joi.validate(freelancer, schema);
}

exports.Freelancer = Freelancer;
exports.validate = validateFreelancer;
