const fs = require("fs");
const userDB = require("../models/admin")
const roleDB = require("../models/role");
const permitDB = require("../models/permit");
const Helper = require("../utils/helper");

const saveData = async (db, data) => {
    await new db(data).save();
}

const migrate = async () => {
    let dataRead = fs.readFileSync("./migration/migration.json");
    let data = JSON.parse(dataRead);
    if (data.users) {
        users = data.users;
        users.forEach(async (user) => {
            let dbUser = await userDB.findOne({ phone: user.phone });
            if (dbUser) {
                user.passwd = Helper.encodePass(user.passwd);
                await userDB.findByIdAndUpdate(dbUser._id, user);
                console.log("User Updated!");
            } else {
                user.passwd = Helper.encodePass(user.passwd);
                saveData(userDB, user);
                console.log("User Added!");
            }
        })
    }
    if (data.roles) {
        roles = data.roles;
        roles.forEach(async (role) => {
            let dbRole = await roleDB.findOne({ name: role.name });
            if (dbRole) {
                console.log("Role Name is already used!");
            } else {
                saveData(roleDB, role);
                console.log("Role Added!");
            }
        })
    }
    if (data.permits) {
        permits = data.permits;
        permits.forEach(async (permit) => {
            let dbPermit = await permitDB.findOne({ name: permit.name });
            if (dbPermit) {
                console.log("Permit Name is already used!");
            } else {
                saveData(permitDB, permit);
                console.log("Permit Added!");
            }
        })
    }

}
const addOwnerRole = async () => {
    let dbOwnerUser = await userDB.findOne({ phone: "09100100100" });
    let dbOwnerRole = await roleDB.findOne({ name: "Admin" });
    let dbPermit = await permitDB.findOne({ name: "Manage_Admin" })
    if (dbOwnerUser && dbOwnerRole && dbPermit) {
        await userDB.findByIdAndUpdate(dbOwnerUser._id, { $push: { role: dbOwnerRole._id } });
        await userDB.findByIdAndUpdate(dbOwnerUser._id, { $push: { permits: dbPermit._id } });
        console.log("Add Owner Role to user");
    } else {
        console.log("No user with Owner Role!");
    }
}

const backUp = async () => {
    let data = await userDB.find();
    fs.writeFileSync("./migration/backup/user.json", JSON.stringify(data));
    console.log("User Data Backuped!");
}

module.exports = {
    migrate,
    backUp,
    addOwnerRole
}