const DB = require("../models/permit");
const adminDB = require("../models/admin");
const Helper = require("../utils/helper");

const all = async (req, res, next) => {
    let permits = await DB.find();
    Helper.fMsg(res, "Get All Permit!", permits);
}
const add = async (req, res, next) => {
    let permit = await DB.findOne({ name: req.body.name });
    if (permit) {
        next(new Error("This Permit is aleardy exist!"));
    } else {
        let result = await DB(req.body).save();
        Helper.fMsg(res, "Add Permit Success!", result);
    }
}

// const drop = async (req, res, next) => {
//     let permit = await DB.findById(req.parmas.id);
//     if (permit) {
//         await DB.findByIdAndDelete(permit._id);
//         Helper.fMsg(res, "Delete Permit Success!");
//     } else {
//         next(new Error("Permit is not Found!"));
//     }
// }

const addPermit = async (req, res, next) => {
    let dbAdmin = await adminDB.findById(req.body.userId);
    let dbPermit = await DB.findById(req.body.permitId);
    if (dbAdmin && dbPermit) {
        if (dbAdmin.agentId.equals(req.user._id)) {
            if (await adminDB.findOne({ permits: req.body.permitId })) {
                next(new Error("User already have this permission!"));
            } else {
                await adminDB.findByIdAndUpdate(dbAdmin._id, { $push: { permits: dbPermit._id } });
                let result = await adminDB.findById(dbAdmin._id).populate("permits", "-__v").select("-passwd -__v");
                Helper.fMsg(res, "Permit Add Success!", result);
            }
        } else {
            next(new Error("You don't have permision!"));
        }
    } else {
        next(new Error("Something is Wrong!"))
    }

}
const removePermit = async (req, res, next) => {
    let dbAdmin = await adminDB.findById(req.body.userId);
    if (dbAdmin) {
        if (dbAdmin.agentId.equals(req.user._id)) {
            let foundPermit = await adminDB.findOne({ permits: req.body.permitId });
            if (foundPermit) {
                await adminDB.findByIdAndUpdate(dbAdmin._id, { $pull: { permits: req.body.permitId } });
                let result = await adminDB.findById(dbAdmin._id).populate("permits", "-__v").select("-passwd -__v");
                Helper.fMsg(res, "Permit Remove Success!", result);
            } else {
                next(new Error("User don't have this permission!"));
            }
        } else {
            next(new Error("You don't have permision!"));
        }
    } else {
        next(new Error("Something is Wrong!"))
    }
}



module.exports = {
    all,
    add,
    addPermit, removePermit
}