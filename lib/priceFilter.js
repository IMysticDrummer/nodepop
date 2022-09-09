'use strict';

/**
 * Function to prepare price integer filter query for mongoDB
 * @param {string} price String
 * @returns integer or object
 * 
 * This function receips one string containing:  
 *  one number;  
 *  two numbers, separates by '-' without spaces;  
 *  one number before '-' without spaces;  
 *  one number after '-' without spaces.  
 *   
 * Returns:  
 * If price is one number, the function returns the number in integer format;  
 * If price are two numbers --> objetct containig
 *  {$gte: first number, $lte: second number};  
 * If price is number+'-' --> object {$gte: number};  
 * If price is '-'+number --> object {$lte: number}
 */
function priceFilter(price) {
  if (price) {
    let query
    let limits=price.split('-');

    if (limits.length===1) {query=parseInt(limits[0])}
    else {
      query={};
      if (limits[0]!=='') {
        query={$gte:parseInt(limits[0])};
      }
      if (limits[1]!=='') {
        query.$lte=parseInt(limits[1]);
      }
    }
    return query;
  }
}

module.exports=priceFilter;