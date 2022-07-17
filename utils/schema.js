const Joi = require("joi");

module.exports = {
    RegisterSchema: Joi.object({
        name: Joi.string().required(),
        passwd: Joi.string().required(),
        phone: Joi.string().min(9).max(11).required(),
        email: Joi.string().email().required()
    }),
    AllSchema: {
        id: Joi.object({
            id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })
    }
}