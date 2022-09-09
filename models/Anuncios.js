'use strict';
const mongoose = require("mongoose");

//advertisement schema
const adsSquema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
})

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
  const query=Advertisement.find(filters);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec();
}

// Creating model
const Advertisement = mongoose.model('Advertisement', adsSquema);

//Exporting model
module.exports=Advertisement;