var express = require("express");
var router = express.Router();

var gameController = require("../controllers/game");

router.post("/api/game/create", gameController.createGame);
router.post(
  "/api/game/:game_id/ticket/:user_name/generate",
  gameController.generateTicket
);
router.get("/ticket/:ticket_id", gameController.printTicket);

router.get("/api/game/:game_id/number/random", gameController.pickRandomNumber);
router.get("/api/game/:game_id/numbers", gameController.getAllNumbers);
router.get("/api/game/:game_id/stats", gameController.gameStatus);
module.exports = router;
