const DB = require("../models/role");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
    let result = await DB.find();
    Helper.fMsg(res, "Get All Roles!", result);
}

module.exports = {
    all,
}