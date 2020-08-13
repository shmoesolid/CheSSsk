
// my lib requires
const config = require("./config");
const Node = require("./Node");
const Piece = require("./Piece");

// enum for direction
// numbered like this so can add N and E together and get NE and so on
const Direction = Object.freeze({
    N:1, E:2, S:4, W:8,
    NE:3, // can add N and E
    SE:6, // can add S and E
    NW:9, // can add N and W
    SW:12 // can add S and W
});

// another enum for updating our attackers in nodes on the fly
// this is used as a param for multiple functions
const UpdateAttackers = Object.freeze({
    NO:0,
    ADD_SELF:1,
    REMOVE_SELF:2
}); 

/** CheSSsk class
 * 
 */
class CheSSsk
{
    constructor()
    {
        this._grid = [];
    }
}