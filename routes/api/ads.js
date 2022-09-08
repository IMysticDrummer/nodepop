const express=require('express');
const router=express.Router();
//Data charger
const Advertisement=require('../../models/Anuncios');
const paramsValidation=require('../../lib/parameterAds');


router.get('/', async (req, res, next) => {

  //query-string parameters capture
  let params=req.query;
  
  //Middelware query-string parameter traitement
  params=paramsValidation(params);
  console.log('parametros: ',params);

  //Creación de la query para mongo
  
  //response
  try {
    const anuncios = await Advertisement.find(params.search).skip(params.start).limit(params.limit).sort(params.sort);
    
    res.json({ results: anuncios });

  } catch (err) {
    next(err);
  }
});

module.exports=router;
