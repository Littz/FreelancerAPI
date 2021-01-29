const Joi = require('joi');
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50
    }
});

const Skill = mongoose.model('Skill', skillSchema);

function validateSkill(skill) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(skill, schema);
}

exports.skillSchema = skillSchema;
exports.Skill = Skill;
exports.validate = validateSkill;
