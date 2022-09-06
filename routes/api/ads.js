const express=require('express');
const router=express.Router();
const ads=require('../../public/ads/ads.json');

router.get('/', (req, res, next) => {
  res.json(ads);
});

module.exports=router;
