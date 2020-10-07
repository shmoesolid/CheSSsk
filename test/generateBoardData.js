var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("W", "K", "a1", true);
game.debug_addPiece("B", "K", "h1", true);

// game.debug_addPiece("B", "K", "h8", true);
// game.debug_addPiece("W", "B", "d4", true);
// game.debug_addPiece("B", "R", "f8", true);

// game.debug_addPiece("W", "N", "c6", true);
// game.debug_addPiece("W", "B", "c5", true);
// game.debug_addPiece("W", "R", "b3", true);
game.debug_addPiece("W", "Q", "h7", true);
game.debug_addPiece("B", "N", "h6", true);
//game.debug_addPiece("B", "N", "h4", true);
game.debug_updateAttackers();

// var nFrom = game._getNodeByString("d5");
// var nTo = game._getNodeByString("b3");
// var dir = getDirection(nFrom, nTo, false);
// var dirNorm = getDirection(nFrom, nTo, true);
// console.log(dir, dirNorm);

//console.log(game.move("b7", "c6"));

var string = game.getGridInJSON();

//console.log("valid moves for: QWe5", game.getValidMoves("e5"));
console.log("valid moves h6", game.getValidMoves("h6"));

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
