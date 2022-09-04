var express = require('express');
var router = express.Router();

let title= "Nodepop - The Web for purchase-sale second-hand articles";

//Vars to use
let ads=[1,2,3,4,5];
let start=0;
let limit=0;
let currentPage=1;
let totalPages=1;

//Functions for pagination
function totalPagesofArray(data, dataPerPage){
  if (dataPerPage>0) {return Math.ceil(data.length / dataPerPage);}
  return 1;
};

function changePage(data, currentPage, dataPerPage) {
  let dataTemp=[...data];
  let totalPages=totalPagesofArray(data, dataPerPage);

  let long=data.length;
  let start=0;
  if (currentPage>1) {
    start=(currentPage-1)*dataPerPage;
  };

  let end=data.length;
  if (currentPage<totalPages) {
    end=currentPage*dataPerPage;
  }

  return dataTemp.slice(start,end);
}

function prevPage(currentPage, data, dataPerPage) {
  if (currentPage>1) {
    currentPage--;
    changePage(data, currentPage, dataPerPage);
  }
};

function nextPage(currentPage, data, dataPerPage) {
  if (currentPage<totalPagesofArray(data, dataPerPage)) {
    currentPage++;
    changePage(data, currentPage, dataPerPage);
  }
};


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
  };

  res.render('index', data);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
