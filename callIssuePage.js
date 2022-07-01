const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const PDFDocument = require('pdfkit');


// callIssuePage recives the issue's page link of any repo, it scrapes all the issues link
// of any repo and stores in the respective json file of the repo

module.exports = function callIssuePage(filePath, link) {

    function extractIssues(htmlData) {
        const $ = cheerio.load(htmlData);

        const issueDivs = $('div[aria-label="Issues"]>.js-navigation-container.js-active-navigation-container .js-issue-row  .flex-auto');

        const data = [];

        for(let i=0; i<issueDivs.length; ++i) {
            const issueLink = 'https://github.com' + $($(issueDivs[i]).find('a')).attr('href');

            // Geeting all the issue links of a repo in a single array
            data.push(issueLink);
        }

        // Writing that array in the JSON file
        fs.writeFileSync(filePath, JSON.stringify(data));

        // Also save the issues in pdf format
        filePath = filePath.slice(0, filePath.indexOf('.')) + '.pdf';

        let pdfDoc = new PDFDocument;
        pdfDoc.pipe(fs.createWriteStream(filePath));
        // Takes in an array of strings and displays them as bullet point
        pdfDoc.list(data);
        pdfDoc.end();

    }

    request(link, function(err, response, htmlData) {
        if(err) {
            console.log(err);
        } else {
            extractIssues(htmlData);
        }
    })


}