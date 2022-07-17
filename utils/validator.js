const jwt = require("jsonwebtoken");
const UserDB = require("../module/user");

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
        if (token) {
            token = token.split(" ")[1];
            let decoded = jwt.decode(token, process.env.SECRET_KEY);
            let user = await UserDB.findById(decoded._id).select("-passwd");
            if (user) {
                req.body["user"] = user;
                next();
            } else {
                next(new Error("Tokenization Error!"))
            }
        } else {
            next(new Error("You are not login!"))
        }
    }
}