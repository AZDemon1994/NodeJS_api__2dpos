const router = require("express").Router();
const controller = require("../controller/user");
const { UserSchema, AllSchema } = require("../utils/schema");
const { validateToken, validateBody, validateParams, hasAnyRole } = require("../utils/validator");

router.route("/")
    .get(validateToken, hasAnyRole(["Bookie", "Agent"]), controller.all)
    .post(validateToken, validateBody(UserSchema.addUser), hasAnyRole(["Bookie", "Agent"]), controller.add)

router.route("/:id")
    .patch(validateToken, validateParams(AllSchema.id, "id"), validateBody(UserSchema.editUser), hasAnyRole(["Bookie", "Agent", "User"]), controller.patch)
    .delete(validateToken, validateParams(AllSchema.id, "id"), hasAnyRole(["Bookie", "Agent"]), controller.drop)

router.route("changepasswd/:id")
    .patch(validateToken, validateParams(AllSchema.id, "id"), validateBody(UserSchema.changePasswd), controller.passwdChange)

module.exports = router;