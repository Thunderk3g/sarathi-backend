const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.role = require("./roles/roles.model");
db.ROLES = ["user", "rider", "admin"];

module.exports = db;