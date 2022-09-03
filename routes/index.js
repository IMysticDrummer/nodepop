var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title:"Nodepop - The Web for purchase-sale second-hand articles",
    ads:[1,2,3,4,5]
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
