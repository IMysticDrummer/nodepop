const express=require('express');
const router=express.Router();

//Data charger
const ads=require('../../public/ads/anuncios.json');

router.get('/', (req, res, next) => {

  let queryRequest=req.query;
  console.log(queryRequest);

  res.json(ads);
});

module.exports=router;
