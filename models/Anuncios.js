'use strict';
const mongoose = require("mongoose");
const {query, body}=require('express-validator');

//Tags permitted
const tagsPermitted=['lifestyle', 'work', 'mobile', 'motor'];

//advertisement schema
const adsSquema = mongoose.Schema({
  nombre: {type: String, required: true},
  venta: {type: Boolean, required: true},
  precio: {type: Number, required: true},
  foto: {type: String, required: true},
  tags: {
    type: [String],
    required: true,
    validate: {
      //Validaton function for tags in tagsPermitted
      validator: function(tags){
        let ok=true;
        tags.forEach(element => {
          ok=ok&&tagsPermitted.includes(element);
        })
        return ok;
      },
      message: `You must indicate one or several tags. Values permmited: ${tagsPermitted}`
    }
  }
});

//DB Indexes
adsSquema.index({nombre:1});
adsSquema.index({nombre:-1});
adsSquema.index({precio:1});
adsSquema.index({precio:-1});
adsSquema.index({venta:1});
adsSquema.index({venta:-1});
adsSquema.index({tags:1});
adsSquema.index({tags:-1});

/**
 * Search in DB Collection, applying filters, pagination, sort and 
 * fields selected.
 * @param {object} filters Possible filters: nombre, venta, precio, tag
 * @param {integer} skip Show result from skip+1
 * @param {integer} limit Show only "limit" results
 * @param {string} sort Sort results by: nombre, venta, precio
 * @param {string} fields Show only the indicated fields
 * @returns Object JSON containing the search results in DB
 */
adsSquema.statics.search=function (filters, skip, limit, sort, fields) {
  const query=Advertisement.find(filters);

  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec();
}

/**
 * This functions makes the data validation by query string for the adsSchema to use with express-validator.  
 * It will check the GET or POST method of transmission (query or body)
 * @param {String} method Method utilised to pass the data. 'get' or 'post'
 * @returns express-validator results for the adsSchema
 */
adsSquema.statics.dataValidator=function (method) {
  if (method==='get') {
  return [
    //GET fields in query
    query('nombre').if(query('nombre').exists()).isString().toLowerCase()
      .withMessage('nombre must be an string'),
    query('venta').if(query('venta').exists()).isBoolean()
      .withMessage('venta must be true or false'),
    //Search fields
    query('tag').if(query('tag').exists()).toLowerCase().isIn(['work', 'lifestyle', 'mobile', 'motor'])
      .withMessage('You must indicate just one word (work, lifestyle, mobile or motor) to find a tag'),    
    query('precio').if(query('precio').exists()).custom(value => {
      const rexExpPattern=new RegExp('([0-9]{1,7}-[0-9]{1,7}|[0-9]{1,7}-|[0-9]{1,7}|-[0-9]{1,7}){1}');
      return rexExpPattern.test(value);
      }).withMessage('precio must be as pattern ([0-9]{1,7}-[0-9]{1,7}|[0-9]{1,7}-|[0-9]{1,7}|-[0-9]{1,7}){1}'),

      //Pagination fields
    query('skip').if(query('skip').exists()).isInt()
      .withMessage('skip must be an integer number'),
    query('limit').if(query('limit').exists()).isInt()
      .withMessage('limit must be an integer number'),
    //Sort field
    query('sort').if(query('sort').exists()).toLowerCase()
      .isIn(['nombre','-nombre', 'precio', '-precio', 'venta', '-venta'])
      .withMessage('Los campos vaídos para ordenar son: (-)nombre, (-)precio o (-)venta')
  ]
  }
  if (method==='post') {
    return [
      //Post fields
      body('nombre').isString().toLowerCase().withMessage('nombre must exist and be an string'),
      body('venta').isBoolean().withMessage('venta must exist and be true or false'),
      body('precio').isFloat().withMessage('precio must exist and must be integer or float'),
      body('foto').toLowerCase().custom(value => {
        const name=value.split('.');
        return (false || name[name.length-1]==='jpg' || name[name.length-1]==='jpeg' || name[name.length-1]==='png')
      }).withMessage('foto file must be an jpg, jpeg or png format'),
      body('tags').custom(value => {
        return false || typeof(value)==='string' || Array.isArray(value);
      })
      .withMessage(`tags must be an array of strings containing one or several of ${tagsPermitted}`)
    ]
  }
}

/**
 * Function to prepare price integer filter query to be use in mongoDB.
 * 
 * This function is only for internal use
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

/**
 * Static method
 * @param {object} req Web Request
 * @returns objetc containing the filters to apply for searching in DB,
 * obtained of the query request
 */
adsSquema.statics.assingFilters=function (req) {
  let filters={};
  if (req.query.nombre) {
    filters.nombre={'$regex':req.query.nombre.toLowerCase(), '$options': 'i'}
  }
  if (req.query.tag) {
    filters.tags=req.query.tag.toLowerCase();
  }
  if (req.query.venta) {filters.venta=req.query.venta}
  if (req.query.precio) {filters.precio=priceFilter(req.query.precio)}

  return filters;
}

// Creating model
const Advertisement = mongoose.model('Advertisement', adsSquema);

//Exporting model
module.exports={Advertisement, tagsPermitted};