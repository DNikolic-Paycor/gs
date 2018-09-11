// var express = require('express');
// var fs = require('fs');
// var request = require('request');
// var cheerio = require('cheerio');
// var app     = express();

// app.get('/scrape', function(req, res){
//     console.log("URL")

//   //All the web scraping magic will happen here
//   url = 'http://www.blic.rs/';
//   request(url, function(error, response, html){

//         // First we'll check to make sure no errors occurred when making the request

//         if(!error){
//             // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

//             var $ = cheerio.load(html);

//             // Finally, we'll define the variables we're going to capture

//             var links;
//             var json = { links:""};
//             $('a').filter(function(){

//                 // Let's store the data we filter into a variable so we can easily see what's going on.
     
//                      var data = $(this);
     
//                 // In examining the DOM we notice that the title rests within the first child element of the header tag. 
//                 // Utilizing jQuery we can easily navigate and get the text by writing the following code:
     
//                     //  title = data.children().first().text();
     
//                 // Once we have our title, we'll store it to the our json object.
     
//                      json.links = data;
//         })
//         fs.writeFile('data.json', JSON.stringify(json, null, 4), function(err){
//             console.log('File successfully written! - Check your project directory for the data.json file');
//         })
//         res.send('Check your console!')
//       }   
//     })
//   })

// app.listen('3000')

// console.log('Magic happens on port 3000');

// exports = module.exports = app;