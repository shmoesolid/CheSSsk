
// BUGS-TO-FIX
// 
// pawn can kill north/south.. (should be fixed)
// king can move into check.. (should be fixed)
// enpassant not functional.. should be once implemented database
// 

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

// enum for updating our attackers in nodes on the fly
// this is used as a param for multiple functions
const UpdateAttackers = Object.freeze({
    NO:0,
    ADD_SELF:1,
    REMOVE_SELF:2
}); 

// quick mapping from letter to num and num to letter
const LETTER_TO_NUM = Object.freeze({ a:0,b:1,c:2,d:3,e:4,f:5,g:6,h:7 });
const NUM_TO_LETTER = Object.freeze([ 'a','b','c','d','e','f','g','h' ]);

/** CheSSsk class
 * 
 * Author: Shane Koehler
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

    /** debug_addPiece
     * 
     * @param {string} piece 
     * @param {string} color 
     * @param {string} locString 
     */
    debug_addPiece(piece, color, locString)
    {
        if (!locString.match(config.PREG_LOCATION))
            throw "debug_addPiece bad location format";

        var [col, row] = locString.split('');
        col = LETTER_TO_NUM[ col ];
        row -= 1;

        if ( this._isOutBounds(col, row) ) //if (typeof this._grid[ col ][ row ] === 'undefined')
            throw "debug_addPiece bad grid location";

        this._grid[ col ][ row ] = new Piece(piece, color, locString);
    }

    /** setGridFromJSON
     * converts json string game data into grid array
     * 
     * @param {string} jsonGameData 
     */
    setGridFromJSON(jsonGameData)
    {
        // convert to object
        var grid = JSON.parse(jsonGameData);

        // count data
        var count = 0;
        grid.forEach( a2d => count += a2d.length )

        // make sure the array count is correct
        if (count != 64)
            return false;

        // set our grid
        this._grid = grid;

        // we set the data
        return true;
    }

    /** getGridInJSON
     * converts array grid data into a json string for database saving
     */
    getGridInJSON()
    {
        return JSON.stringify(this._grid);
    }

    /** setupNewGame
     * sets up new chess game in the grid
     */
    setupNewGame()
    {
        for (var x = 0; x < 8; x++)
        {
            for (var y = 0; y < 8; y++)
            {
                // assign to vars for readability
                var currentNode = this._grid[ x ][ y ];
                var locString = NUM_TO_LETTER[ x ] + (y+1);

                // setup color based on Y (row) location in grid
                var color = "";
                if (y > 5) color = "B"; // black
                else if (y < 2) color = "W"; // white

                // prime piece string
                var piece = "";

                // pawn rows (all columns)
                if (y == 1 || y == 6)
                {
                    piece = "P";
                }

                // back rows (big dog pieces)
                else if (y == 0 || y == 7)
                {
                    // handle columns a-h (1-8)
                    switch( x )
                    {
                        // rook columns
                        case 0: // a
                        case 7: // h
                            piece = "R"; break;

                        // knight columns
                        case 1: // b
                        case 6: // g
                            piece = "N"; break;

                        // bishop columns
                        case 2: // c
                        case 5: // f
                            piece = "B"; break;

                        // queen column
                        case 3: // d
                            piece = "Q"; break;

                        // king column
                        case 4: // e
                            piece = "K"; break;
                    }
                }

                // null rest of empty places on the board for grins
                else
                {
                    currentNode.p = null;
                }

                // create new piece if circumstances exist
                // locString only used for ID generation
                if (piece)
                {
                    currentNode.p = new Piece(piece, color, locString);
                }
            }
        }

        // now that all pieces are set we need to go back through and update all their attacking spaces
        // couldn't do this in previous loop because first set of pieces added was white whole back row before pawns,
        // this would have added all wrong attacking spaces as other pieces are needed to block our otherwise valid moves
        for (var x = 0; x < 8; x++)
            for (var y = 0; y < 8; y++)
                this.getValidMoves( NUM_TO_LETTER[x] + (y+1), UpdateAttackers.ADD_SELF);

        // return grid array
        return this._grid;
    }

    /** move
     * make the move
     * 
     * @param {string} from 
     * @param {string} to 
     * @param {string} enPassant
     */
    move(from, to, enPassant = "")
    {
        // get valid moves for from location
        var response = this.getValidMoves(from);

        // we aren't ok, return full response
        if (response.status !== "OK")
            return response;

        // get node both nodes from strings (don't need to check currentNode as getValidMoves already did this)
        var currentNode = this._getNodeByString(from);
        var destinationNode = this._getNodeByString(to);

        // our to location is not a valid location to move
        if (destinationNode === false || response.results.indexOf( destinationNode ) === -1)
            return { status: "INVALID_DESTINATION" };

        // we have a legit move!  HOOORAAY
        // ..

        // get node if we have an enPassant location string and if our piece type moving is also a pawn
        var enPassantNode = (enPassant !== "" && currentNode.p.type === "P") ? this._getNodeByString(enPassant) : false;

        // remove all our attacking spaces from current node
        this._removeAttackingSpaces(from);

        // remove attacking spaces if piece in destination node
        if (destinationNode.p !== null)
            this._removeAttackingSpaces(to);

        // otherwise if we're dealing with enpassant, get the piece responsible
        else if (enPassantNode !== false) 
        {
            // get our pawn associated with enPassant location
            // understand this is backwards because lets say white pawn is moving into enPassant node
            // then we are taking a black piece therefore we subtract 1 from y to get the node below
            // and if black taking white we add 1 from y as our white pawn should be above it
            var changeY = ( currentNode.p.color === "W" ) ? enPassantNode.y - 1 : enPassantNode.y + 1;

            // so no with our changeY we can get the node of the pawn piece causing all this chaos
            var pawnNode = this._grid[ enPassantNode.x ][ changeY ];

            // confirm now our piece info in pawn node is a pawn and not our color
            if (pawnNode.p === null 
                || pawnNode.p.type !== "P"
                || pawnNode.p.color === currentNode.p.color
            ) {
                return { status: "INVALID_ENPASSANT" };
            }

            // remove our associated pawn attack points
            var pawnString = NUM_TO_LETTER[ pawnNode.x ] + pawnNode.y;
            this._removeAttackingSpaces(pawnString);
        }

        // handle removed piece if taking one
        var removedPiece = destinationNode.p;
        if (typeof pawnNode !== 'undefined') 
        {
            removedPiece = pawnNode.p;
            pawnNode.p = null;
        }

        // set our piece to destination and clear old
        destinationNode.p = currentNode.p;
        currentNode.p = null;

        // update hasMoved bool
        destinationNode.p.hasMoved = true;

        // .. TODO handle castling
        // .. TODO handle pawn on back row
        // .. TODO handle removedPiece

        // update our attacking spaces in new node
        return this._addAttackingSpaces(to);
    }

    /** getValidMoves
     * validate a move against current grid
     * 
     * simply gives all valid moves from a location (ie a5)
     * it determines piece info based on location
     * can also update attacking spaces
     * 
     * @param {string} from 
     * @param {UpdateAttackers} updateAttackers 
     * @param {string} enPassant 
     */
    getValidMoves(from, updateAttackers = UpdateAttackers.NO, enPassant = "")
    {
        // gets our node by the passed string (does all the needed checks/corrections)
        var currentNode = this._getNodeByString(from);

        // return if not a valid location
        if (currentNode === false)
            return { status: "INVALID_LOCATION" };

        // confirm piece exists
        if (currentNode.p == null)
            return { status: "NULL_PIECE" };

        // know what kind of piece we are moving so we can setup proper algo
        switch ( currentNode.p.type )
        {
            case "K": // king
                return { status: "OK", results: this._getKingMoves( currentNode, updateAttackers )};

            case "Q": // queen
                return { status: "OK", results: this._getAllDirections( currentNode, updateAttackers )};

            case "B": // bishop
                return { status: "OK", results: this._getDiagnals( currentNode, updateAttackers )};

            case "N": // knight
                return { status: "OK", results: this._getKnightMoves( currentNode, updateAttackers )};

            case "R": // rook
                return { status: "OK", results: this._getVertHorz( currentNode, updateAttackers )};

            case "P": // pawn
                return { status: "OK", results: this._getPawnMoves( currentNode, updateAttackers, enPassant )};

            default:
                return { status: "INVALID_TYPE" };
        }
    }

    /** _getAllDirections
     * gets all (N S E W NE SE SW NW)
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getAllDirections(node, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {
        // establish moves array
        var moves = [];

        // get all possible directions using established functions
        moves = moves.concat( this._getDiagnals( node, updateAttackers, numSpace ));
        moves = moves.concat( this._getVertHorz( node, updateAttackers, numSpace ));

        // return all moves
        return moves;
    }

    /** _getDiagnals
     * gets diagnals only (NE SE SW NW)
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getDiagnals(node, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {
        // establish moves array
        var moves = [];

        // get all possible moves in all diagnal directions
        for (var d = Direction.NE; d <= Direction.SW; d+=3)
            moves = moves.concat( this._getMovesInDirection(node, d, updateAttackers, numSpace) );

        // return all moves minus any empty returns
        return moves;
    }

    /** _getVertHorz
     * gets vertical and horizontal only (N S E W)
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getVertHorz(node, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {
        // establish moves array
        var moves = [];

        // get all possible moves in both vertical and horizontal axis
        for (var d = Direction.N; d <= Direction.W; d*=2)
            moves = moves.concat( this._getMovesInDirection(node, d, updateAttackers, numSpace) );

        // return all moves
        return moves;
    }

    /** _getMovesInDirection
     * gets number moves in any 1 direction only
     * 
     * @param {Node} node 
     * @param {Direction} dir 
     * @param {UpdateAttackers} updateAttackers 
     * @param {number} numSpace 
     */
    _getMovesInDirection(node, dir, updateAttackers = UpdateAttackers.NO, numSpace = 0)
    {
        // establish moves array
        var moves = [];

        // establish x and y
        var x = 0;
        var y = 0;

        // change x and/or y modification based on direction
        switch( dir )
        {
            case Direction.N:
                y = 1; break;

            case Direction.E:
                x = 1; break;

            case Direction.S:
                y = -1; break;

            case Direction.W:
                x = -1; break;

            case Direction.NE:
                x = y = 1; break;

            case Direction.SE:
                x = 1; y = -1; break;

            case Direction.SW:
                x = y = -1; break;

            case Direction.NW:
                x = -1; y = 1; break;

            default:
                throw "Invalid direction";
        }

        // we make these loops 1 - 8 instead as we don't need to check ourselves (aka 0)
        // using these with our modifiers to move 1 space on the first iteration
        // loop along every col (aka X coord)
        for (var col = 1; col < 9; col++)
        {
            // establish new check for X coords
            // (running this here because if next to checkY it would run these calcs
            // multiple times which isn't needed as these numbers aren't changing)
            var checkX = node.x + (x * col);

            // loop along every row (aka Y coord) in column
            for (var row = 1; row < 9; row++)
            {
                // establish new check Y coords
                var checkY = node.y + (y * row);

                // assign last node in moves if even doesn't exist yet
                var last = moves[ moves.length - 1 ];

                // the idea here is we are technically marching along in 1 direction, but
                // we need a good filter to prove we are on a point that's in the right direction.
                // so we have our x and y modifiers already so we know based off that where we need to go.
                // the first node added is always proper as it used our modifiers exactly as the are from it
                // so, we subtract the current check coords with the last correct node (which will be 
                // updated with the new one if proven correct) and if they do not match our modifiers then
                // we are in the wrong pattern of movement.  so skip.
                if (last !== undefined)
                {
                    var normalizedX = checkX - last.x;
                    var normalizedY = checkY - last.y;

                    if (normalizedX != x || normalizedY != y)
                        continue;
                }

                // return if we are out of bounds
                if ( this._isOutBounds(checkX, checkY) )
                    return moves;

                // assign new valid location in grid to another var for readability
                var currentNode = this._grid[ checkX ][ checkY ];

                // handle update of attackers
                // we are attacking this space regardless of ANY piece in it regardless of color
                // add ourself as attacker in this node with own piece ID (add handles duplicates, see node class)
                if (updateAttackers == UpdateAttackers.ADD_SELF)
                    currentNode.addAttackerByID( node.p.getID() );

                // remove ourself on the fly if ordered to
                else if (updateAttackers == UpdateAttackers.REMOVE_SELF)
                    currentNode.removeAttackerByID( node.p.getID() );

                // return if colors match as we can't move into a node occupied by our own piece
                // or if we are a pawn and NOT moving in a diagnal direction
                // (all diagnal directions are divisible by 3)
                if (currentNode.p != null 
                    && (node.p.color == currentNode.p.color
                        || (node.p == "P" && (dir % 3) !== 0)
                    )
                ) {
                    return moves;
                }
                    
                // add to return array as we have valid node we can move to
                moves.push( currentNode );

                // return if enemy's piece exists here as we can't move beyond it
                // or if we are only allowed to go X num spaces (0 is no limit)
                if ( currentNode.p != null || numSpace > 0 && moves.length >= numSpace )
                    return moves;

            }
        }
    }

    /** _getKingMoves
     * get king only valid moves
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     */
    _getKingMoves(node, updateAttackers = UpdateAttackers.NO)
    {
        // establish moves array
        var moves = [];

        // establish/prime inCheck bool
        var inCheck = false;
        
        // get if king is in check by checking all IDs attacking our space
        node.getAttackers().forEach( id => {

            // get first char of ID (which is color of attacking piece)
            if (id.charAt(0) != node.p.color)
            {
                // we are in check as colors don't match, set true and break
                inCheck = true;
                return; // use return instead of break in forEach
            }
        });

        // king has not moved or has moved but is in check
        // get all directions 1 space
        if (node.p.hasMoved || inCheck)
            moves = moves.concat( this._getAllDirections(node, updateAttackers, 1) );

        // king has not moved yet and not in check, check for castling
        else
        {
            // get diagnals by 1 space
            moves = moves.concat( this._getDiagnals(node, updateAttackers, 1 ));

            // get north or south depending on color (ie white king can't move south so why check)
            moves = moves.concat( 
                this._getMovesInDirection( 
                    node,
                    (node.p.color == "W") ? Direction.N : Direction.S,
                    updateAttackers,
                    1
                )
            );

            // castling
            // do a special loop which handles both a and h (or 1 and 8) columns (aka X) only
            for (var col = 0; col < 8; col += 7)
            {
                // assign for readability using the row (y) our king is on
                var rookNode = this._grid[ col ][ node.y ];

                // make sure piece exists and hasn't moved (pointless to confirm piece as rook too)
                if ( rookNode.p != null && !rookNode.p.hasMoved )
                {
                    // set our direction based on which column
                    var direction = (col == 1) ? Direction.W : Direction.E;

                    // try to move 2 spaces in corresponding direction
                    moves = moves.concat( this._getMovesInDirection(node, direction, updateAttackers, 2));
                }
            }
        }

        // strip all moves that put the king in check
        // allow only moves where enemy is not attacking
        moves = moves.filter( move => !move.isEnemyAttacking(node.p.color) );

        // return possible moves
        return moves;
    }

    /** _getKnightMoves
     * get knight only valid moves (see thought process after return)
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     */
    _getKnightMoves(node, updateAttackers = UpdateAttackers.NO)
    {
        // establish moves array
        var moves = [];

        // go through all possibles
        for (var x = -2; x < 3; x++)
        {
            for (var y = -2; y < 3; y++)
            {
                // skip if either are 0 as they will break below math
                if (x == 0 || y == 0)
                    continue;

                // this math determines we are using valid x/y modifiers outside of 0s
                // skip if our math didn't come out to 1 as it should have
                if ( Math.abs( Math.abs(x + y) - 2 ) != 1 )
                    continue;

                // get check coords
                // (doing X here because not doing that many plus calc is simpler and readability)
                var checkX = node.x + x;
                var checkY = node.y + y;

                // skip if out of bounds
                if ( this._isOutBounds(checkX, checkY) )
                    continue;

                // assign new valid location in grid for readability
                var currentNode = this._grid[ checkX ][ checkY ];

                // handle update of attackers
                // we are attacking this space regardless of ANY piece in it regardless of color
                // add ourself as attacker in this node with own piece ID (ad dhandles duplicates, see node class)
                if (updateAttackers == UpdateAttackers.ADD_SELF)
                    currentNode.addAttackerByID( node.p.getID() );

                // remove ourself on the fly if ordered to
                else if (updateAttackers == UpdateAttackers.REMOVE_SELF)
                    currentNode.removeAttackerByID( node.p.getID() );

                // skip if colors match as we can't move onto a node occupied by our own piece
                if ( currentNode.p != null && node.p.color == currentNode.p.color )
                    continue;

                // add node to moves
                moves.push(currentNode);
            }
        }

        // return possible moves
        return moves;

        /* Math logic layout/thought process
		
            // north east
            x = 1; y = 2; // sum 3
            
            // north west
            x = -1; y = 2; // sum 1
            
            // east north
            x = 2; y = 1; // sum 3 // abs 3 // minus 2 is 1 // abs 1
            
            // east south
            x = 2; y = -1; // sum 1 // abs 1 // minus 2 is -1 // abs 1
            
            // south east
            x = 1; y = -2; // sum -1 // abs 1 // minus 2 is -1 // abs 1
            
            // south west
            x = -1; y = -2; // sum -3 // abs 3 // minus 2 is 1 // abs 1
            
            // west north
            x = -2; y = 1; // sum -1
            
            // west south
            x = -2; y = -1; // sum -3
            
            // 0 and 1 will be abs 1 so get rid of any 0s off the bat
            // math should handle all others
		
		*/
    }

    /** _getPawnMoves
     * 
     * @param {Node} node 
     * @param {UpdateAttackers} updateAttackers 
     * @param {string} enPassantLoc 
     */
    _getPawnMoves(node, updateAttackers = UpdateAttackers.NO, enPassantLoc = "")
    {
        // establish moves array
        var moves = [];

        // vertical direction matters depending on color
        var vertDir = ( node.p.color == "W" ) ? Direction.N : Direction.S;

        // get vertical move(s) in proper direction
        // force update attacking false here because we cannot attack vertically regardless
        moves = moves.concat(this._getMovesInDirection( node, vertDir, false, (node.p.hasMoved) ? 1 : 2 ));

        // go back and remove last vertical moves that have a piece in it as pawns can only kill
        // diagnally and _getMovesInDirection does not take that into account as it does not check
        // specific piece info other than color, this is on purpose
        // remove last element if it contains a piece
        if ( !moves && moves[moves.length-1] != null)
            moves.pop();

        // loop through both possible diagnal kills
        Array(Direction.E, Direction.W).forEach(
            (horzDir) => {
                // diagnal kill to the east or west (only 1 index should exist if at all)
                var testMoves = this._getMovesInDirection( node, (vertDir + horzDir), updateAttackers, 1 );

                // make sure not empty
                if (testMoves.length > 0)
                {
                    // readability
                    var move = testMoves[0];

                    // handle update of attackers
                    // we are attacking this space regardless of ANY piece in it regardless of color
                    // add ourself as attacker in this node with own piece ID (add handles duplicates, see node class)
                    if (updateAttackers == UpdateAttackers.ADD_SELF)
                        move.addAttackerByID(node.p.getID());

                    // remove ourself on the fly if ordered to
                    else if (updateAttackers == UpdateAttackers.REMOVE_SELF)
                        move.removeAttackerByID(node.p.getID());

                    // add only if an enemy exists
                    // friendly piece already ruled out in _getMovesInDirection if not updating attackers
                    if (move.p != null && move.p.color != node.p.color)
                        moves.push(move);
                }

                // handle en passant if string passed from database
                else
                {
                    // get node by string
                    var newNode = this._getNodeByString(enPassantLoc);

                    // skip if node doesn't exist or if piece data isn't empty
                    if (newNode === false || !newNode.p)
                        return; // use return instead of continue in forEach loops

                    // add to moves array
                    moves.push(newNode);
                }
            }
        );

        // return our available moves
        return moves;
    }

    /** _removeAttackingSpaces
     * 
     * @param {string} from 
     */
    _removeAttackingSpaces(from)
    {
        return this.getValidMoves(from, UpdateAttackers.REMOVE_SELF);
    }

    /** _addAttackingSpaces
     * 
     * @param {string} from 
     */
    _addAttackingSpaces(from)
    {
        return this.getValidMoves(from, UpdateAttackers.ADD_SELF);
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
        if ( this._isOutBounds(x, y) ) // if (typeof this._grid[x][y] === 'undefined')
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

module.exports = CheSSsk;