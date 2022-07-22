const Joi = require("joi");

module.exports = {
    AdminSchema: {
        login: Joi.object({
            phone: Joi.string().min(9).max(11).required(),
            passwd: Joi.string().min(6).max(20).required()
        }),
        addAdmin: Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().min(9).max(11).required(),
            passwd: Joi.string().min(6).max(20).required()
        })
    },
    UserSchema: {
        addUser: Joi.object({
            name: Joi.string().required(),
            phone: Joi.string().min(9).max(11).required(),
            passwd: Joi.string().min(6).max(20).required(),
        }),
        login: Joi.object({
            phone: Joi.string().min(9).max(11).required(),
            passwd: Joi.string().min(6).max(20).required()
        }),
        editUser: Joi.object({
            name: Joi.string(),
            status: Joi.boolean(),
        }),
        changePasswd: Joi.object({
            passwd: Joi.string().min(6).max(20).required()
        })
    },
    PermitSchema: {
        add: Joi.object({
            name: Joi.string().required()
        }),
        permitToUser: Joi.object({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
            permitId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })
    },
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