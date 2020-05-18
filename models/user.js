var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: { type: Schema.Types.String, required: true, unique: true },
});

// Export the model
module.exports = mongoose.model("User", userSchema);
