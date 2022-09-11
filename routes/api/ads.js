const express=require('express');
const router=express.Router();
const {validationResult, body} = require('express-validator');
//Data charger
const {Advertisement, tagsPermitted}=require('../../models/Anuncios');
const priceFilter=require('../../lib/priceFilter');

//Route /api?...
router.get('/', Advertisement.dataValidator(), async (req, res, next) => {
  try {
    validationResult(req).throw();
  } catch (error) {

    return res.status(422).json({error: error.array()})

/*
    Código válido para fallos en la web

    console.log(error.errors);
    error.status=422;
    next(error);
*/
  }
  let filters={};
  
  if (req.query.nombre) {
    filters.nombre={'$regex':req.query.nombre.toLowerCase(), '$options': 'i'}
  }
  if (req.query.tag) {
    filters.tags=req.query.tag.toLowerCase();
  }
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

router.get('/tags', async (req, res, next) => {
  let filters={};
  let results={};

  for (let index = 0; index < tagsPermitted.length; index++) {
    const element = tagsPermitted[index];
    filters.tags=element;
    const tempResult=await Advertisement.search(filters)
    results[element]=tempResult.length;
    
  }

  res.json({results: results});
});

module.exports=router;
