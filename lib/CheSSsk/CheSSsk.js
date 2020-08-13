
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

// quick mapping from letter to num and num to letter
const LETTER_TO_NUM = { a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:8 };
const NUM_TO_LETTER = [ 'a','b','c','d','e','f','g','h' ];

/** CheSSsk class
 * 
 */
class CheSSsk
{
    constructor()
    {
        // setup grid
        this._grid = [];
        for (var x=0; x<8; x++)
        {
            this._grid[x] = [];

            for (var y=0; y<8; y++)
                this._grid[x][y] = new Node(x, y);
        }
    }

    /** getValidMoves
     * 
     * @param {string} from 
     * @param {UpdateAttackers} updateAttackers 
     * @param {string} enPassant 
     */
    getValidMoves(from, updateAttackers = UpdateAttackers.NO, enPassant = "")
    {

    }

    /** _getAllDirections
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getAllDirections(node, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {

    }

    /** _getDiagnals
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getDiagnals(node, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {

    }

    /** _getVertHorz
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getVertHorz(node, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {

    }

    /** _getMovesInDirection
     * 
     * @param {Node} node 
     * @param {Direction} dir 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getMovesInDirection(node, dir, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {

    }

    /** _getKingMoves
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     */
    _getKingMoves(node, updateAttackers = UpdateAttackers.NO)
    {

    }

    /** _getKnightMoves
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     */
    _getKnightMoves(node, updateAttackers = UpdateAttackers.NO)
    {

    }

    /** _getPawnMoves
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {string} enPassantLoc 
     */
    _getPawnMoves(node, updateAttackers = UpdateAttackers.NO, enPassantLoc = "")
    {
    
    }

    /** _getNodeByString
     * 
     * @param {string} string 
     */
    _getNodeByString(string)
    {
        // return if empty or unmatched
        if ( !string || !string.match(config.PREG_LOCATION) )
            return false;

        // separate out string to row and column
        var [x, y] = string.split('');

        // convert column letter to number and adjsut row
        x = LETTER_TO_NUM[ x ];
        y -= 1;

        // return if grid doesn't exit
        if (typeof this._grid[x][y] === 'undefined')
            return false;

        // return valid location
        return this._grid[x][y];
    }

    /** _isOutBounds
     * 
     * @param {number} x 
     * @param {number} y 
     */
    _isOutBounds(x, y)
    {
        // return true if is outside of bounds
        if ( x < 0 || x > 7 || y < 0 || y > 7)
            return true;

        // otherwise false
        return false;
    }


}