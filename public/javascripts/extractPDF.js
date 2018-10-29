var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var phantom = require('phantom');
var axios = require('axios');
var async = require("async");
var extract = require('pdf-text-extract');
var hummus = require('hummus');
var path = require('path');
var convertToLat = require('cyrillic-to-latin')
const convertToCyr = require('latin-to-serbian-cyrillic')
const hasCyr = require('has-cyr');
const pdftotext = require('pdftotextjs');
const PDFDocument = require('pdfkit')
const write = require('fs-writefile-promise')


/// TAKE ALL PDF FROM SERVER CHANGE TEST FOLDER TO VALID URL 

var testFolder = path.join(__dirname, '/source/');

function extractPDF(keywords1, company, today) {
  let sourceArr = []
  fs.readdirSync(testFolder).forEach(file => {
    var str = file
    var n = str.startsWith(today);
    // console.log("STARTS WITH",n,today,str)
    sourceArr.push(file)
  })
  console.log("PATHS",sourceArr)

  if (sourceArr.length) {
    for (let i=0; i < sourceArr.length;i++){
      extractA(sourceArr[i],keywords1,company,today);
  }
}
}

function extractA(source,keywords1,company,today){
   // for (let i = 0; i <= source.length - 1; i++) {
    console.log("SOURCE",source)
    if (typeof source != 'undefined') {
      var sourcePDF = path.join(__dirname, `/source/${source}`);
      var outputFolder = path.join(__dirname, '/output/');
      var keywords = keywords1 || [];

     extract(sourcePDF, (err, pages) => {
        console.log("POKRENULO  SE ZA",sourcePDF)
        if (err) console.log(err);
        for (let i = 0; i < pages.length;i++) {
          let keywordsConverted = keywords1
          // for (let j=0 ; j< keywords.length ; j++){
            // let keyword = keywords[j]
            // if (hasCyr(keyword)) {
            //   keywordsConverted = keywords.map(word =>convertToLat(keyword))
            // }
            let cyr = hasCyr(pages[i])
              if (cyr) {
                keywordsConverted = keywords.map(word => convertToCyr(word))
                console.log("KEYWORDS CONVERTED FOR ",company,keywordsConverted)
              }
            // }
              if (keywordsConverted.some(function(v) { return pages[i].toLowerCase().indexOf(v.toLocaleLowerCase()) >= 0; })){
                console.log("NASAO JE REZULTAT za",source)
                var name = Math.random().toString(36).substring(7);
                var pdfWriter = hummus.createWriter(path.join(outputFolder, `${today}-${company}-${name}.pdf`));
                pdfWriter.appendPDFPagesFromPDF(sourcePDF, { type: hummus.eRangeTypeSpecific, specificRanges: [[i, i]] });
                pdfWriter.end();
                modify(keywords,today,company);
              }
        }
      });
    }
  }
// END OF  EXTRACT 
 async function modify(keywords,today,company){
   console.log("POKRENUO SE MODIFY")
  doc = new PDFDocument
  let source = []
  var outputFolder = path.join(__dirname, '/output/');
  fs.readdirSync(outputFolder).forEach(file => {
    var str = file
    var n = str.startsWith(today);
    // console.log("STARTS WITH",n,today,str)
    source.push(file)
  })
  let textArr = []
  
  for (let single of source){
    var str = single
    var n = str.startsWith(today+"-"+company);
    // console.log("STARTSS WITH",n,"NAME OF FILE",today+"-"+company )
    if (n){
      const p = takeText(single,keywords,outputFolder)
      textArr.push(p)
    }
  }
  Promise.all(textArr).then(
    data => async.map(data, writeHmtl, function(err, results) {
  })
  )
 }
 


async function takeText(single,keywords,outputFolder){
    let textObj
    doc = new PDFDocument
    let inputFile = path.join(outputFolder, single)
    let modified = __dirname + `/modified/${single}-modified.html`
    let pdf = new pdftotext(inputFile);
    const data = pdf.getTextSync(); // returns buffer
    let text = data.toString('utf8').toLowerCase(); // bilo je 'utf8'
    return textObj = { text: text, link:modified, keywords:keywords }
}

function writeHmtl(obj){
  let keyword = obj.keywords
  keyword.forEach( word => {
    if (hasCyr(obj.text)) {
      word = convertToCyr(word)
    }
     obj.text = obj.text.replace(new RegExp(word, 'g'),"<span style ='color:red'><b>" + word.toUpperCase() + "</b></span>")
  })
  fs.writeFile(obj.link,obj.text,function (err) {
    if (err) throw err;
      console.log('Saved!');
  }
)
}

module.exports.extractPDF = extractPDF;