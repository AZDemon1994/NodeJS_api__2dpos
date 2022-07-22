const router = require("express").Router();
const controller = require("../controller/admin");
const { validateBody, validatePermit, validateToken, validateRole, validateParams } = require("../utils/validator");
const { AdminSchema, AllSchema } = require("../utils/schema");


router.post("/login", validateBody(AdminSchema.login), controller.login);
router.get("/clients", [validateToken, controller.getClients]);
router.get("/:id", [validateToken, validateParams(AllSchema.id, "id"), controller.get])
//TODO: Disiable Client,

//   ------- Owner Special Route
router.get("/", [validateToken, validatePermit("Manage_Admin"), controller.all]);
router.post("/add/admin", [validateToken, validateBody(AdminSchema.addAdmin), validatePermit("Manage_Admin"), controller.addAdmin("Admin")]);
router.delete("/:id", [validateToken, validatePermit("Manage_Admin"), validateParams(AllSchema.id, "id"), controller.drop]);


// ----------  Admin Special Route
router.post("/add/bookie", [validateToken, validateBody(AdminSchema.addAdmin), validateRole("Admin"), controller.addAdmin("Bookie")]);
router.delete("/remove/bookie/:id", [validateToken, validateParams(AllSchema.id, "id"), validateRole("Admin"), controller.removeAdmin("Bookie")]);
//TODO: View Bookie Client


// ------------ Bookie Special route
router.post("/add/agent", [validateToken, validateBody(AdminSchema.addAdmin), validateRole("Bookie"), controller.addAdmin("Agent")]);
router.delete("/remove/agent/:id", [validateToken, validateParams(AllSchema.id, "id"), validateRole("Bookie"), controller.removeAdmin("Agent")]);

//------------- Bookie & Agent Special route




module.exports = router;