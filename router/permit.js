const router = require("express").Router();
const controller = require("../controller/permit");
const { validateBody, validateRole, validateToken, validatePermit } = require("../utils/validator");
const { RegisterSchema, PermitSchema } = require("../utils/schema");

router.route("/")
    .get(validateToken, controller.all)
    .post(validateToken, validatePermit("Manage_Admin"), validateBody(PermitSchema.add), controller.add)

router.post("/add/admin", [validateToken, validateRole("Admin"), validateBody(PermitSchema.permitToUser), controller.addPermit]);
router.post("/remove/admin", [validateToken, validateRole("Admin"), validateBody(PermitSchema.permitToUser), controller.removePermit]);

// router.route("/id")
//     .get(controller.get)
//     .patch(controller.patch)
//     .delete(controller.drop)


module.exports = router;