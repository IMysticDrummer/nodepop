'use strict';
const mongoose = require("mongoose");
const {check}=require('express-validator');

//Tags permitted
const tagsPermitted=['lifestyle', 'work', 'mobile', 'motor'];

//advertisement schema
const adsSquema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function(tags){
        let ok=false;
        tags.forEach(element => {
          tagsPermitted.forEach(tag => {
            ok=ok||element===tag;
          });
        })
        return ok;
      },
      message: "tags permmited: lifestyle, work, motor or mobile"
    }
  }
});
adsSquema.index({nombre:1});
adsSquema.index({nombre:-1});
adsSquema.index({precio:1});
adsSquema.index({precio:-1});
adsSquema.index({venta:1});
adsSquema.index({venta:-1});
adsSquema.index({tags:1});
adsSquema.index({tags:-1});

/**
 * 
 * @param {object} filters Possible filters: nombre, venta, precio, tag
 * @param {integer} skip Show result from skip+1
 * @param {integer} limit Show only "limit" results
 * @param {string} sort Sort results by: nombre, venta, precio
 * @param {string} fields Show only the indicated fields
 * @returns Object JSON containing the search results in DB
 */
adsSquema.statics.search=function (filters, skip, limit, sort, fields) {
  if(filters.tags) {
    console.log(filters);
  }
  const query=Advertisement.find(filters);
  console.log(query);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec();
}

/**
 * This functions makes the data validation for the adsSchema to use with express-validator.  
 * It will check all the posibilities of transmission (body, query, params, headers or cookies)
 * @returns express-validator results for the adsSchema
 */
adsSquema.statics.dataValidator=function () {
  return [
    //common fields
    check('nombre').if(check('nombre').exists()).isString().toLowerCase().withMessage('nombre must be an string'),
    check('venta').if(check('venta').exists()).isBoolean().withMessage('venta must be true or false'),
    //Search fields
    check('tag').if(check('tag').exists()).toLowerCase().isIn(['work', 'lifestyle', 'mobile', 'motor'])
      .withMessage('You must indicate just one word (work, lifestyle, mobile or motor) to find a tag'),    
    check('precio').if(check('precio').exists()).custom(value => {
      const rexExpPattern=new RegExp('([0-9]{1,7}-[0-9]{1,7}|[0-9]{1,7}-|[0-9]{1,7}|-[0-9]{1,7}){1}');
      return rexExpPattern.test(value);
      }).withMessage('precio must be as pattern ([0-9]{1,7}-[0-9]{1,7}|[0-9]{1,7}-|[0-9]{1,7}|-[0-9]{1,7}){1}'),
    //Pagination fields
    check('skip').if(check('skip').exists()).isInt().withMessage('skip must be an integer number'),
    check('limit').if(check('limit').exists()).isInt().withMessage('limit must be an integer number'),
    //Sort field
    check('sort').if(check('sort').exists()).toLowerCase().isIn(['nombre','-nombre', 'precio', '-precio', 'venta', '-venta'])
    .withMessage('Los campos vaídos para ordenar son: (-)nombre, (-)precio o (-)venta')
  ]
}

// Creating model
const Advertisement = mongoose.model('Advertisement', adsSquema);

//Exporting model
module.exports={Advertisement, tagsPermitted};