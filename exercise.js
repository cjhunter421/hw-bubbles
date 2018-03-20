//Chris Hunter and Kathy Dieppa
//HW-Bubbles

//initiate requrired packages
var req = require('sync-request');
var minify = require('html-minifier').minify;
var cheerio = require('cheerio');
var fs = require('fs');

var exercise = {};

exercise.one = function(){

    console.log('Running exercise 1');
    //Extract urls from the homepage
    var url = 'http://student.mit.edu/catalog/index.cgi';
    fileName = './experiment/mainpage.html';
    savePageHtml(url,fileName);


    // get the homepage url
    function savePageHtml(url,filename){
        var res = req('GET',url);
        fs.writeFileSync(filename,res.getBody().toString());
    };

    // User cheerio to parse html
    function extractUrls (hmtlFileName){
        var data = fs.readFileSync(hmtlFileName);
        var $ = cheerio.load(data);
        var urls = [];
        $('A').each(function(i,element){
            urls.push($(element).attr());
        });
        return urls;
    };

    var homeUrls = extractUrls('./experiment/mainpage.html');

      // Filter bad urls - not 'm'
    function filterUrls (badUrls){
        var filteredUrls = badUrls.map(function(object){
            var stringified = object.href.toString();
            if (stringified.charAt(0) === 'm' && stringified.includes('.html')
            && stringified !== undefined){
                return object.href;
            };

        });
        return filteredUrls;
    }
    var departmentUrls = filterUrls(homeUrls);
    var finalUrls = [];

    //iterate over the departments
    departmentUrls.forEach(function(element){
        urlname =  'http://student.mit.edu/catalog/' + element;
        if (urlname != 'http://student.mit.edu/catalog/undefined'){
             fileName = './experiment/' + element;
             savePageHtml(urlname,fileName);
             finalUrls.push(urlname);
        }
     });

    return finalUrls;

};

exercise.two = function(){

    console.log('Running exercise 2');

    var urls = exercise.one();
    var numFiles = 0;

    urls.forEach((url,index)=>{
        var res = request('GET',url);
        var filename = './catalog/' + index + '.html';
        fs.writeFileSync(filename,res.getBody().toString());
        numFiles+=1;
    } );

    return numFiles;

};

exercise.three = function(){

    console.log('Running exercise 3');

    //Aggregate files
    var allNames = []
    var numFiles = exercise.two();

    for (var i =0; i<numFiles; i++){
        allNames.push('./catalog/' + i + '.html')
    }

    // Write catalog.txt file to compress size
    var data = '';
    fs.writeFileSync('./catalog/catalog.txt',data);

    allNames.forEach((file,index) => {
        var data = fs.readFileSync(file);
        fs.appendFileSync('./catalog/catalog.txt',data);
    })
};


exercise.four = function(){

    console.log('Running exercise 4');


    //take in text to be mini'd
    var longText = fs.readFileSync('./catalog/catalog.txt');
    var minifiedText = minify(longText.toString(),{
        minifyJS : true,
        minifyCSS : true,
        collapseWhitespace : true,
    });
    var cleanText = minifiedText.replace(/'/g,'');
    //return clean text to the catalog
    fs.writeFileSync('./catalog/clean.txt',cleanText);

    console.log('Text cleaned up, probably.');
};

exercise.five = function(){

    console.log('running exercise 5');

    //input the clean text
    var data = fs.readFileSync('./catalog/clean.txt');


    var $ = cheerio.load(data);
    var majors = [];

    //parse through the data for each major
    $('h3').each(function(i,element){
        majors.push($(element).text());
    });
    console.log('Majors added.');
    return majors;

};

exercise.six = function(){

    console.log('running exercise 6');

    var data = fs.readFileSync('./catalog/clean.txt');


     var $ = cheerio.load(data);
     var titles = [];


     //parse through data for each course title
     $('h3').each(function(i,element){
         titles.push($(element).text());
     });

     console.log('Titles added.');

     return titles;

};

exercise.seven = function(){

    console.log('running exercise 7');

    var courses = exercise.six();

    //clean up the titles from exercise 6
    var cleanWordArray = courses.map(function(courses){
        var courseWordArray = courses.toLowerCase().match(/([a-z]+)/g);

        var filteredWords = courseWordArray.filter(word => word.length > 1 );

        var filteredWords = courseWordArray.filter( word =>
            word != 'in' && word != 'and' && word != 'of' && word != 'the' && word != 'to');

        return filteredWords;
    });

    return cleanWordArray;

};

exercise.eight = function(){

    //input words
    var words = exercise.seven();
    //turn words into an array
    var wordsflat = words.reduce(function(previous,current){
        return previous.concat(current)
    },[])

    return wordsflat;

};

exercise.nine = function(){

    //input words
    var wordsflat = exercise.eight();

    //count frequencies
    var count = wordsflat.reduce(function(previous,current){
            if(current in previous){
                previous[current] += 1;
            }
            else{
                previous[current] = 1;
            }
            return previous;
        },{});
        var dataFile = 'var count = '+ JSON.stringify(scores);
        var filename = './catalog_count.js';
        fs.writeFileSync(filename,dataFile);
        return count;

};
console.log('Zhu Li, do the thing!');

module.exports = exercise;
