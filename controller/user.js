const DB = require("../models/user");
const adminDB = require("../models/admin");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
    let users = await DB.find({ agentId: req.user._id }).select("-passwd -__v");
    Helper.fMsg(res, "Get All Users", users);
}
const add = async (req, res, next) => {
    let dbUser = await DB.findOne({ phone: req.body.phone }).select("-passwd -__v");
    if (dbUser) {
        next(new Error("Phone is already Used!"));
    } else {
        req.body.agentId = req.user._id;
        req.body.bookieId = req.user.bookieId;
        req.body.passwd = Helper.encodePass(req.body.passwd);
        await DB(req.body).save();
        let result = await DB.findOne({ phone: req.body.phone }).select("-passwd -__v");
        await adminDB.findByIdAndUpdate(req.user._id, { $push: { users: result._id } });
        Helper.fMsg(res, "Create User Success!", result);
    }
}
const patch = async (req, res, next) => {
    let dbUser = await DB.findById(req.params.id).select("-passwd -__v");
    if (dbUser) {
        if (dbUser._id.equals(req.user._id) || dbUser.agentId.equals(req.user._id)) {
            await DB.findByIdAndUpdate(dbUser._id, req.body);
            let result = await DB.findById(dbUser._id).select("-passwd -__v");
            Helper.fMsg(res, "Edit User Success!", result);
        } else {
            next(new Error("No user with this ID!"));
        }
    } else {
        next(new Error("No user with this ID!"));
    }
}
const drop = async (req, res, next) => {
    let dbUser = await DB.findOne({ _id: req.params.id, agentId: req.user._id }).select("-passwd -__v");
    if (dbUser) {
        await DB.findByIdAndDelete(dbUser._id);
        await adminDB.findByIdAndUpdate(req.user._id, { $pull: { users: dbUser._id } });
        Helper.fMsg(res, "Delete User Success!")
    } else {
        next(new Error("No user with this ID!"));
    }
}

const passwdChange = async (req, res, next) => {
    let dbUser = await DB.findById(req.params.id).select("-passwd -__v");
    if (dbUser) {
        if (dbUser._id.equals(req.user._id)) {
            req.body.passwd = Helper.encodePass(req.body.passwd);
            await DB.findByIdAndUpdate(dbUser._id, req.body);
            Helper.fMsg(res, "Password Change Success!")
        } else {
            next(new Error("No user with this ID!"));
        }
    } else {
        next(new Error("No user with this ID!"));
    }
}

module.exports = {
    all, add, patch, drop,
    passwdChange
}