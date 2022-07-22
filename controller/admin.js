const DB = require("../models/admin");
const roleDB = require("../models/role");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
    let result = await DB.find().populate("role", "-permit -__v").select("-passwd -__v");
    Helper.fMsg(res, "Get All Admin!", result);
}
const get = async (req, res, next) => {
    let dbAdmin = await DB.findById(req.params.id);
    if (dbAdmin) {
        let result = await DB.findById(dbAdmin._id).select("-passwd -__v");
        Helper.fMsg(res, "Get Admin!", result)
    } else {
        next(new Error("There isn't User!"))
    }
}
const drop = async (req, res, next) => {
    let dbAdmin = await DB.findById(req.params.id);
    if (dbAdmin) {
        await DB.findByIdAndUpdate(dbAdmin.agentId, { $pull: { clients: dbAdmin._id } });

        await DB.findByIdAndDelete(dbAdmin._id);
        Helper.fMsg(res, "Deleted User!")
    } else {
        next(new Error("There isn't User!"))
    }
}
const login = async (req, res, next) => {
    let dbUser = await DB.findOne({ phone: req.body.phone }).select("-clients -users -__v -created");
    if (dbUser) {
        let passwdResult = Helper.comparePass(req.body.passwd, dbUser.passwd);
        if (passwdResult) {
            let loginUser = dbUser.toObject();
            delete loginUser.passwd;
            loginUser.token = Helper.makeToken(loginUser);
            Helper.fMsg(res, "Login Success!", loginUser)
        } else {
            next(new Error("Phonenumber or Password is Wrong!!"))
        }
    } else {
        next(new Error("Phonenumber or Password is Wrong!!"))
    }
}
const getClients = async (req, res, next) => {
    let result = await DB.find({ agentId: req.user._id }).populate("role", "-__v -permit -_id").select("-passwd -__v");
    Helper.fMsg(res, "Get All Clients", result);
}


const addAdmin = (role) => {
    return async (req, res, next) => {
        let dbPhoneAdmin = await DB.findOne({ phone: req.body.phone });
        if (dbPhoneAdmin) {
            next(new Error("Phone is already used!"));
            return;
        }
        req.body.passwd = Helper.encodePass(req.body.passwd);
        let dbRole = await roleDB.findOne({ name: role });
        if (dbRole) {
            req.body.role = dbRole._id;
            req.body.agentId = req.user._id;

            let result = await new DB(req.body).save();
            await DB.findByIdAndUpdate(req.user._id, { $push: { clients: result._id } });

            if (role == "Bookie") {
                await DB.findByIdAndUpdate(result._id, { $push: { bookieId: result._id } });
            }
            if (role == "Agent") {
                await DB.findByIdAndUpdate(result._id, { $push: { bookieId: req.user.bookieId } })
            }
            result = await DB.findById(result._id).select("-passwd -__v")
            Helper.fMsg(res, `Add ${role} Success!`, result);
        } else {
            next(new Error("You can't give this role!"));
        }
    }
}
const removeAdmin = (role) => {
    return async (req, res, next) => {
        let dbAdmin = await DB.findById(req.params.id);
        if (dbAdmin) {
            if (dbAdmin.agentId.equals(req.user._id)) {
                await DB.findByIdAndDelete(dbAdmin._id);
                await DB.findByIdAndUpdate(req.user._id, { $pull: { clients: dbAdmin._id } });
                Helper.fMsg(res, `Delete ${role} Success`)
            } else {
                next(new Error("No User with this ID!"));
            }
        } else {
            next(new Error("No User with this ID!"));
        }
    }
}



module.exports = {
    all, get, drop,
    login,
    addAdmin, removeAdmin,
    getClients
}