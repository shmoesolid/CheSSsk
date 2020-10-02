
/** Node class for CheSSsk
 * 
 * Author: Shane Koehler
 */
class Node
{
    /**
     * 
     * @param {number} _x 
     * @param {number} _y 
     */
    constructor(_x, _y)
    {
        this.x = _x;
        this.y = _y;

        this.p = null;
        this._attackers = [];
    }

    /** getAttackers
     * gets all node's attackers or filtered out by color and/or type
     * 
     * @param {object} filter
     * 
     * supports { color: string, types: array of strings }
     */
    getAttackers(filter = null)
    {
        // no filter, return all
        if (!filter)
            return this._attackers;

        // return mapped copy with items we want only
        var filteredAttackers = this._attackers.filter( id => 
                (typeof filter.color === 'string' && id.charAt(0) == filter.color)
                || (typeof filter.types !== 'undefined' 
                    && Array.isArray(filter.types) 
                    && filter.types.indexOf( id.charAt(1) ) !== -1
                )
        );

        return filteredAttackers;
    }

    /** isEnemyAttacking
     * check if an enemy of the opposite color is attacking this node
     * 
     * @param {string} color 
     */
    isEnemyAttacking(color)
    {
        // loop through attackers and get first char of id (color of attacking piece)
        // and return true if we find any of the opposite color
        for (var i=0; i<this._attackers.length; i++)
            if (this._attackers[i].charAt(0) != color)
                return true;

        // whew no attackers
        return false;
    }

    /** addAttackerByID
     * add an attacker by id
     * (id generated or assigned by piece construct)
     * 
     * @param {string} id 
     */
    addAttackerByID(id)
    {
        // add to array if doesn't already exist
        if (this._attackers.indexOf(id) == -1)
            this._attackers.push(id);
    }

    /** removeAttackerByID
     * remove an attacker by id
     * 
     * @param {string} id 
     */
    removeAttackerByID(id)
    {
        // search for key/index by id
        var key = this._attackers.indexOf(id);

        // if found, remove it
        if (key !== -1) this._attackers.splice(key, 1);
    }
}

module.exports = Node;