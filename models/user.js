const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, require: true },
    phone: { type: String, require: true, unique: true },
    passwd: { type: String, require: true },
    agentId: { type: Schema.Types.ObjectId, require: true, ref: "admin" },
    bookieId: { type: Schema.Types.ObjectId, require: true, ref: "admin" },
    balance: { type: Number, default: 0 },
    lone: { type: Number, default: 0 },
    loneTime: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    orders: [{ type: Schema.Types.ObjectId, ref: "" }],
    created: { type: Date, default: Date.now }
})

const User = mongoose.model("user", UserSchema);

module.exports = User;