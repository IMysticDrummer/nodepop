const express=require('express');
const router=express.Router();
//Data charger
const Advertisement=require('../../models/Anuncios');
const priceFilter=require('../../lib/priceFilter');

router.get('/', async (req, res, next) => {
  let filters={};
  
  if (req.query.nombre) {filters.nombre=req.query.nombre}
  if (req.query.tag) {filters.tags=req.query.tag}
  if (req.query.venta) {filters.venta=req.query.venta}
  if (req.query.precio) {filters.precio=priceFilter(req.query.precio)}

  const skip=req.query.skip;
  const limit=req.query.limit;

  const sort=req.query.sort;

  try {
    
    const ads= await Advertisement.search(filters, skip, limit, sort);
    res.json({results:ads});

  } catch (error) {
    next(error);
  }
});

module.exports=router;
