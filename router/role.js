const router = require("express").Router();
const controller = require("../controller/role");
const { validateBody, validateParams, validateToken } = require("../utils/validator");
const { RegisterSchema } = require("../utils/schema");

router.route("/")
    .get(controller.all)

module.exports = router;