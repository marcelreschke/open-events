var cheerio = require('cheerio');
request = require('request');
moment = require('moment');
moment().format();
moment().locale("de");
var sources = require('./sourcefiles.json');

console.log("Scraping data for: " + sources.Name);

sources.Data.forEach(function(item) {
  console.log("Processing: " + item.Kategorie);
  item.src.forEach(function(SubKategorie) {
    console.log("Recieving: " + SubKategorie.SubKategorie);
    request(sources.baseURL + SubKategorie.file, function(error, response, body) {
      if (!error) {
        var $ = cheerio.load(body, {
          xmlMode: true
        });
        $('content').each(function(i, element) {
          if (i > 0) {
            var $ = cheerio.load(element, {
              xmlMode: true
            });
            var downloadName = $('Category').text().trim();
            var downloadVersion = $('no').text();
            var downloadDes = $('Des').text().trim();
            var downloadLink = $('link').text();
            var downloadJSON = {
              "order": i,
              "Name": downloadName,
              "Beschreibung": downloadDes,
              "Link": 'http://54.200.75.24/english/EncodeUrl.aspx?source=' + encodeURIComponent(downloadLink),
              "Kategorie": item.Kategorie,
              "SubKategorie": SubKategorie.SubKategorie,
              "Version": downloadVersion
                //   "description": eventDescription,
                //   "location_id": "44101",
                //   "location": {
                //     "@type": "Place",
                //     "address": {
                //       "@type": "PostalAddress",
                //       "streetAddress" : "Ritterstr. 20",
                //       "addressLocality" : "Dortmund",
                //       "postalCode" : "44137"
                //       }
                //     },
                //   "startDate": moment(eventDate +  " " + eventStartTime, "DD.MM..YYYY HH.mm") ,
                //   "url": eventUrl[i]
            }

            console.log(JSON.stringify(downloadJSON) + ",");
          }
        });
      } else {
        console.log("Übersicht HTTP Request fehlgeschlagen: " + error);
      }
    });
  });
});
