'use strict';

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