const jwt = require("jsonwebtoken");
const AdminDB = require("../models/admin");
const PermitDB = require("../models/permit");
const RoleDB = require("../models/role");

module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                next(new Error(result.error.details[0].message));
            } else {
                next();
            }
        }
    },
    validateParams: (schema, name) => {
        return (req, res, next) => {
            let obj = {};
            obj[`${name}`] = req.params[`${name}`];
            const result = schema.validate(obj);
            if (result.error) {
                next(new Error(result.error.details[0].message));
            } else {
                next();
            }
        }
    },
    validateToken: async (req, res, next) => {
        let token = req.headers.authorization;
        try {
            if (token) {
                token = token.split(" ")[1];
                let decoded = jwt.verify(token, process.env.SECRET_KEY);
                let user = await AdminDB.findById(decoded._id).select("-passwd");
                if (user) {
                    req.user = user;
                    next();
                } else {
                    next(new Error("Tokenization Error!"))
                }
            } else {
                next(new Error("You are not login!"))
            }
        } catch (error) {
            next(new Error(error));
        }
    },
    validatePermit: (permit) => {
        return async (req, res, next) => {
            if (req.user) {
                let loginUser = await AdminDB.findById(req.user._id).select("-passwd -__v");
                let dbPermit = await PermitDB.findOne({ name: permit });
                let findPermit = loginUser.permits.find(permit => permit.equals(dbPermit._id));
                if (findPermit) {
                    next();
                } else {
                    next(new Error("You don't have permision!"));
                }
            } else {
                next(new Error("You are not login!"));
            }
        }
    },
    validateRole: (role) => {
        return async (req, res, next) => {
            if (req.user) {
                let loginUser = await AdminDB.findById(req.user._id).select("-passwd -__v");
                let dbRole = await RoleDB.findOne({ name: role });
                let findRole = loginUser.role.equals(dbRole._id);
                if (findRole) {
                    next();
                } else {
                    next(new Error("You don't have permision!"));
                }
            } else {
                next(new Error("You are not login!"));
            }
        }
    },
    hasAnyRole: (roles) => {
        return async (req, res, next) => {
            let bol = false;
            let loginUser = await AdminDB.findById(req.user._id).populate("role").select("-passwd -__v");
            roles.forEach(role => {
                if (loginUser.role.name == role) {
                    bol = true;
                }
            })
            bol ? next() : next(new Error("You don't have this permision!"));
        }
    }

}