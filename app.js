var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var screpBlic = require('./public/javascripts/getDataBlic.js')
var screp24 = require('./public/javascripts/getData24.js')
var screpB92 = require('./public/javascripts/getDataB92.js')
var screpKurir = require('./public/javascripts/getDataKurir.js')
var screpDanas = require('./public/javascripts/getDataDanas.js')
var screpInformer = require('./public/javascripts/getDataInformer.js')
var screpPolitika = require('./public/javascripts/getDataPolitika.js')
var screpAlo = require('./public/javascripts/getDataAlo.js')
var screpNovosti = require('./public/javascripts/getDataNovosti.js')
var screpPravda = require('./public/javascripts/getDataPravda.js')
// var extractPDF = require('./public/javascripts/extractPDF.js')
const axios = require('axios');
var ontime = require('ontime')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users/', usersRouter);

// let arr = []
// let routes=`${domain_name}/javascripts/modified/${namePDF}`

// app.get('/pdfs',express.static(__dirname + `/javascripts/modified/1c4vkn.pdf-modified.pdf`))

// app.get('/pdfs/:name',function (req, res, next) {
//   console.log("PARAMATERS",req.params)
//   // res.render('pdfs',{ title: 'PDFS',name:req.params.name });
//   return express.static(__dirname + `/javascripts/modified/${req.param.name}.pdf`)
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

/// PORTALS FOR SCREPPING , CRONE JOBS

ontime({
  cycle: [ '11:57:00' ]
}, function (ot) {
  axios.get('https://press-cliping.herokuapp.com/api/companies?api_key=23')
  .then( async response =>{
    if (response.data.success == true) {
      let companies = response.data.company
      companies.map(company => {
         let keywords = [] 
         company.keywords.map( word => keywords.push(word.name))

            // screpNovosti.getNewsNovosti(keywords,company.name,company.id)
            // screpPolitika.getNewsPolitika(keywords,company.name,company.id)
            // screpBlic.getNewsBlic( keywords,company.name,company.id)
            // screp24.getNews24( keywords,company.name,company.id )
            // screpB92.getNewsB92(keywords,company.name,company.id )
      })
    }
  })
  .catch(error => {
    console.log(error);
  });
  ot.done()
  return
})

ontime({
  cycle: [ '13:23:00' ]
}, function (ot) {
  console.log("CRONE JOB")
  axios.get('https://press-cliping.herokuapp.com/api/companies?api_key=23')
  .then( async response => {
    if (response.data.success == true) {
      let companies = response.data.company
      companies.map(company => {
         let keywords = [] 
         company.keywords.map( word => keywords.push(word.name))
         
        //  screpKurir.getNewsKurir( keywords,company.name,company.id )
         screpDanas.getNewsDanas( keywords,company.name,company.id)
          //  screpInformer.getNewsInformer( keywords,company.name,company.id)
            // screpAlo.getNewsAlo( keywords,company.name,company.id)
          // screpPravda.getNewsPravda( keywords,company.name,company.id)
      })
    }
  })
  .catch(error => {
    console.log(error);
  });
  ot.done()
  return
})


//PDF HANDLING
// extractPDF.extractPDF()
// error handler

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
