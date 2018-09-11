var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express.Router();

/* GET users listing. */
router.post('/', async function (req, res, next) {
  url = 'http://www.blic.rs/';
  var json = []
  var keyword = req.body.keyword.split(' ').join('-')
  request(url, async function (error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);
      await $(`a[href*=${keyword}]`.toLowerCase()).each(function () {
        var text = $(this).text();
        var link = $(this).attr('href');
         json.push({ text, link })
      })
      res.json(json)
    }
  });

  console.log("NESTO SE DESAVA")
})

module.exports = router;
