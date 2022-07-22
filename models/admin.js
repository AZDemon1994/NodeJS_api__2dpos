const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    passwd: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "role" },
    permits: [{ type: Schema.Types.ObjectId, ref: "permit" }],
    clients: [{ type: Schema.Types.ObjectId, ref: "admin" }],
    users: [{ type: Schema.Types.ObjectId, ref: "user" }],
    agentId: { type: Schema.Types.ObjectId, ref: "admin" },
    bookieId: { type: Schema.Types.ObjectId, ref: "admin" },
    status: { type: Boolean, default: true },
    created: { type: Date, default: Date.now }
});


const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;