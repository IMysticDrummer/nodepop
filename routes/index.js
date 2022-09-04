var express = require('express');
var router = express.Router();
let pagination=require('../public/javascripts/pagination.js');

let title= "Nodepop - The Web for purchase-sale second-hand articles";

//Vars to use
let ads=[1,2,3,4,5,6,7];
let start=0;
let limit=20;
let currentPage=1;
//Limit ads-list
let totalPages=pagination.totalPagesOfArray(ads,limit);
console.log(totalPages)
let adsTemp=pagination.changePage(ads,currentPage,limit);
console.log(adsTemp);
let adsTemp2=pagination.changePage(ads,++currentPage,limit);
console.log(adsTemp2);
let adsTemp3=pagination.changePage(ads,++currentPage,limit);
console.log(adsTemp3);
//Functions for pagination --> exported


//Objet to view
let data={
  title: title,
  ads: ads,
  start:start,
  limit:limit,
  currentPage:currentPage,
  totalPages: totalPages
};

//Routes
router.get('/', (req, res, next) => {
  console.log('params ');
  console.log('artPerPage: '+req.query.artPerPage);
  console.log('page: '+req.query.page + ' '+typeof(req.query.page));

  if (req.query.artPerPage!==undefined) {
    let adsTemp=[...ads];
    
    data.limit=parseInt(req.query.artPerPage,10);
    console.log(typeof(data.limit));
    adsTemp=ads.slice(data.start,data.start+data.limit);
    data.ads=adsTemp;

    data.start+=data.limit;

  } else {
    data.ads=ads;
    data.start=data.limit=0;
  }

  res.render('index', data);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
