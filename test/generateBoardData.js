var fs = require('fs');
const CheSSsk = require("../");

var game = new CheSSsk();
game.debug_addPiece("K", "W", "d2", true);
game.debug_addPiece("Q", "B", "d7", true);
game.debug_updateAttackers();
var string = game.getGridInJSON();

fs.writeFile("board_data.js", `var boardData = '${string}';`, function(err) {
    if (err) return console.log(err);
    console.log("done...");
});
