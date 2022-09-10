const express=require('express');
const router=express.Router();
const {query, validationResult, body} = require('express-validator');
//Data charger
const Advertisement=require('../../models/Anuncios');
const priceFilter=require('../../lib/priceFilter');

//Route /api?...
router.get('/', 
  query('nombre').if(query('nombre').exists()).isString().withMessage('nombre must be an string'),
  query('tag').if(query('tag').exists()).isString().withMessage('You must indicate just one word to find a tag'),
  query('venta').if(query('venta').exists()).isBoolean().withMessage('venta must be true or false'),
  query('precio').if(query('precio').exists()).custom(value => {
    const rexExpPattern=new RegExp('([0-9]{1,7}\-[0-9]{1,7}|[0-9]{1,7}\-|[0-9]{1,7}|\-[0-9]{1,7}){1}');
    return rexExpPattern.test(value);
  }).withMessage('precio must be as pattern ([0-9]{1,7}\-[0-9]{1,7}|[0-9]{1,7}\-|[0-9]{1,7}|\-[0-9]{1,7}){1}')
  ,
async (req, res, next) => {
  //const errors=validationResult(req);
  //if (!errors.isEmpty()) {return res.status(422).json({error: errors.array()})}
  try {
    validationResult(req).throw();
  } catch (error) {
    console.log(error);
    next(error);
  }
  let filters={};
  
  if (req.query.nombre) {filters.nombre=req.query.nombre}
  if (req.query.tag) {filters.tags=req.query.tag}
  if (req.query.venta) {filters.venta=req.query.venta}
  if (req.query.precio) {filters.precio=priceFilter(req.query.precio)}

  const skip=req.query.skip;
  const limit=req.query.limit;

  const sort=req.query.sort;

  const fields=req.query.fields;

  try {
    
    const ads= await Advertisement.search(filters, skip, limit, sort, fields);
    res.json({results:ads});

  } catch (error) {
    next(error);
  }
});

module.exports=router;
