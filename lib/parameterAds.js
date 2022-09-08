'use strict';

function paramsAdsTraitement (params){
  let result={}

  if (params!=undefined) {
    if (params.tag||params.nombre||params.precio||params.venta) {
      result.search={};
    }

    //if (params.nombre!==undefined) {result.search.nombre=`{$text:{$search:'${params.nombre}}}`}
    if (params.nombre!==undefined) {result.search.nombre=params.nombre}

    if (params.precio!==undefined) {
      let query
      let limits=params.precio.split('-');
      console.log(limits);

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
      result.search.precio=query;
    }

    if (params.tag!==undefined) {result.search.tags=params.tag}

    if (params.sort !== undefined) {result.sort=params.sort}

    if (params.venta!== undefined) {result.search.venta=params.venta}
    if (params.start !== undefined) {result.start=params.start}
    if (params.limit != undefined) {result.limit= params.limit}
  }

  return result;
}

module.exports=paramsAdsTraitement;