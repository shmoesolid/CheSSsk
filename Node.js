
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
     * simply returns our attackers array
     */
    getAttackers()
    {
        return this._attackers;
    }

    /** isEnemyAttacking
     * check if an enemy of the opposite color is attacking this node
     * 
     * @param {string} color 
     */
    isEnemyAttacking(color)
    {
        // loop through attackers
        this._attackers.forEach(
            (id) => {
                // get first char of id (color of attacking piece)
                // return true if opposite of param
                if (id.charAt(0) != color)
                    return true;
            }
        );

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
        if ((key = this._attackers.indexOf(id)) !== -1)
            this._attackers.splice(key, 1);
    }
}

module.exports = Node;