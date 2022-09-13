var express = require('express');
var router = express.Router();
const {Advertisement}=require('../models/Anuncios');

let title= "Nodepop - The Web for purchase-sale second-hand articles";

//Objet to view
let data={
  title: title
};

//Routes GET home page
router.get('/', async (req, res, next) => {
  //Filters
  let filters=Advertisement.assingFilters(req);

  //Pagination
  data.skip=req.query.skip;
  data.limit=req.query.limit;

  //Sort
  const sort=req.query.sort;

  //Fields
  const fields=req.query.fields;

  //Search and render
  try {
    data.ads= await Advertisement.search(filters, data.skip, data.limit, sort, fields);
    res.render('index', data);
  } catch(error) {
    next(error);
  }
});

module.exports = router;
