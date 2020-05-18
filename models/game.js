var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var gameSchema = new Schema({
  drawSequence: [Schema.Types.Number],
  drawIndex: { type: Schema.Types.Number, default: 0 },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

// Export the model
module.exports = mongoose.model("Game", gameSchema);
