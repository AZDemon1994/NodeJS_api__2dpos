const router = require("express").Router();
const controller = require("../controller/user");
const {validateBody, validateParams, validateToken} = require("../utils/validator");
const {RegisterSchema} = require("../utils/schema");


router.post("/login", controller.login);
router.post("/register", controller.add);


module.exports = router;