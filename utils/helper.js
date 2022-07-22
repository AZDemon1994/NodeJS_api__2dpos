const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fMsg = async (res, msg = "Success", result = []) => {
    res.status(200).json({
        con: true,
        msg: msg,
        result: result
    })
}


module.exports = {
    encodePass: (passwd) => bcrypt.hashSync(passwd),
    comparePass: (plain, hash) => bcrypt.compareSync(plain, hash),
    makeToken: payload => jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" }),
    fMsg,
}
