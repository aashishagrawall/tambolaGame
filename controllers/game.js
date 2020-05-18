const Game = require("../models/game");
const Ticket = require("../models/ticket");
const User = require("../models/user");
const tambola = require("tambola");
const ObjectId = require("mongoose").Types.ObjectId;
const { table } = require("table");

exports.createGame = async (req, res) => {
  try {
    const drawSequence = tambola.getDrawSequence();
    const gameModel = new Game({
      drawSequence: drawSequence,
    });
    const result = await gameModel.save();
    res.status(200).json({
      status: true,
      gameId: result._id,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: `Something went wrong --> ${err.message}`,
    });
  }
};

exports.generateTicket = async (req, res) => {
  const gameId = req.params.game_id;
  const userName = req.params.user_name;
  try {
    let userId;
    const user = await User.findOne({ userName: userName }).lean();

    if (!user) {
      const userModel = new User({
        userName: userName,
      });
      const userSaved = await userModel.save();
      userId = userSaved._id;
    } else {
      userId = user._id;
    }

    const game = await Game.findOneAndUpdate(
      { _id: gameId },
      {
        $addToSet: { users: userId },
      }
    );
    if (!game) {
      return res.status(404).json({
        status: false,
        message: `Game with given gameId not found -> ${gameId}`,
      });
    }

    const ticketModel = new Ticket({
      ticket: tambola.generateTicket(),
      gameId: gameId,
      userId: userId,
    });
    const ticketSaved = await ticketModel.save();
    res.json({ status: true, ticketId: ticketSaved._id });
  } catch (err) {
    res.status(500).json({
      status: false,
      error: `Something went wrong --> ${err.message}`,
    });
  }
};

exports.printTicket = async (req, res) => {
  const ticketId = req.params.ticket_id;
  try {
    const ticket = await Ticket.findById(ticketId).lean();
    if (ticket) {
      const output = table(ticket.ticket);
      console.log(output);

      return res.status(200).json({
        status: true,
        message: "See the console ouput",
        ticket: ticket.ticket,
      });
    }
    return res.status(404).json({
      status: false,
      message: `Ticket with given ticketId not found -> ${ticketId}`,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something went wrong --> ${err.message}`,
    });
  }
};

exports.pickRandomNumber = async (req, res) => {
  const gameId = req.params.game_id;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        status: false,
        message: `Game with given gameId not found -> ${gameId}`,
      });
    }

    if (game.drawIndex >= 90) {
      return res
        .status(400)
        .json({ status: false, message: "All random variable have exhausted" });
    }
    const number = game.drawSequence[game.drawIndex];

    game.drawIndex = game.drawIndex + 1;
    await game.save();
    res.status(200).json({
      status: true,
      number: number,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something Went Wrong -> ${err.message}`,
    });
  }
};

exports.getAllNumbers = async (req, res) => {
  const gameId = req.params.game_id;

  try {
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({
        status: false,
        message: `Game with given gameId not found -> ${gameId}`,
      });
    }

    res.status(200).json({
      status: true,
      numbers: game.drawSequence.slice(0, game.drawIndex),
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something Went Wrong -> ${err.message}`,
    });
  }
};

exports.gameStatus = async (req, res) => {
  const gameId = req.params.game_id;

  try {
    const result = await Game.aggregate([
      { $match: { _id: ObjectId(gameId) } },
      {
        $lookup: {
          localField: "_id",
          from: "tickets",
          foreignField: "gameId",
          as: "tickets",
        },
      },
    ]);

    if (result.length == 0) {
      return res.status(404).json({
        status: false,
        message: `Game with given gameId not found -> ${gameId}`,
      });
    }

    res.json({
      status: true,
      noOfUsers: result[0].users.length,
      noOftickets: result[0].tickets.length,
      numbersDrawn: result[0].drawIndex,
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: `Something Went Wrong -> ${err.message}`,
    });
  }
};
