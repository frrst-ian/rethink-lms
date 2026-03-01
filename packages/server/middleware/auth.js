const passport = require("../config/passport");
const authenticateJwt = passport.authenticate("jwt", { session: false });
module.exports = authenticateJwt;