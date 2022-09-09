'use strict';
const mongoose = require("mongoose");

//advertissement schema
const adsSquema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
})

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