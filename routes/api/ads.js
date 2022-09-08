const express=require('express');
const router=express.Router();
//Data charger
const Advertisement=require('../../models/Anuncios');


router.get('/', async (req, res, next) => {

  //query-string parameters capture
  const params=req.query.nombre;
  console.log('parametros: ',params);
  //Middelware query-string parameter traitement
  
  //response
  try {
    const anuncios = await Advertisement.find();
    
    res.json({ results: anuncios });

  } catch (err) {
    next(err);
  }
});

module.exports=router;
