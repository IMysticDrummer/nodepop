const express=require('express');
const router=express.Router();
const {validationResult} = require('express-validator');
const {Advertisement, tagsPermitted}=require('../../models/Anuncios');
const priceFilter=require('../../lib/priceFilter');

//Route /api?...
router.get('/', Advertisement.dataValidatorGET(), async (req, res, next) => {
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

//Route api/tags --> Return tags permitted with the number of ads with this tag included
router.get('/alltags', async (req, res, next) => {
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

//Router / method POST --> Save a new advertisement
router.post('/', Advertisement.dataValidatorPOST(), async (req, res, next) => {
  //Data validation
  try {
    validationResult(req).throw();
  } catch (error) {
    return res.status(422).json({error: error.array()})
  }

  //Tags format
  let tagsTemp;
  if (typeof(req.body.tags)==='string') {tagsTemp=[req.body.tags]}
  else {tagsTemp=req.body.tags}

  //Model
  const ad= new Advertisement ({
    nombre: req.body.nombre,
    venta: false||req.body.venta,
    precio: 0||parseFloat(req.body.precio),
    foto: req.body.foto,
    tags: tagsTemp 
  });

  //Saving document in DB
  try {
    const adCreated=await ad.save();
    res.status(201).json({result: {id: adCreated.__id, msg:`Anuncio ${adCreated.nombre} succesfully created`}});
  } catch (error) {
    //If it's validation error, the object error has not array function.
    try {
      const fail=error.array();
      return res.status(422).json({error: fail});  
    } catch (err) {
      return res.status(422).json({error: error});
    }
  }

});

module.exports=router;
