var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ticketSchema = new Schema({
  ticket: { type: Schema.Types.Array },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  gameId: { type: Schema.Types.ObjectId, required: true, ref: "Game" },
});

// Export the model
module.exports = mongoose.model("Ticket", ticketSchema);
