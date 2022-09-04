var express = require('express');
var router = express.Router();
let pagination=require('../public/javascripts/pagination.js');

let title= "Nodepop - The Web for purchase-sale second-hand articles";

//Vars to use
let ads=[1,2,3,4,5,6,7];
let start=0;
let limit=3;
let currentPage=1;
//Limit ads-list
let totalPages=pagination.totalPagesOfArray(ads,limit);
let adsTemp=pagination.changePage(ads,currentPage,limit);

//Functions for pagination --> exported


//Objet to view
let data={
  title: title,
  ads: adsTemp,
  start:start,
  limit:limit,
  currentPage:currentPage,
  totalPages: totalPages
};

//Routes
router.get('/', (req, res, next) => {
  if (req.query.page!==undefined){
    currentPage=req.query.page;
    adsTemp=pagination.changePage(ads,currentPage,limit);
    data.ads=[...adsTemp];
    data.currentPage=currentPage;
  }
  res.render('index', data);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
