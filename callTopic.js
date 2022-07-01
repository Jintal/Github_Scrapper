const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const callIssuePage = require('./callIssuePage.js');

// callTopic receives the link of the Topic page and the calls it
// It then scrapes the top 8 repos from that page and makes a json file for each repo under the directory of the topic
// It then scrapes the issue's page link of all the 8 repos and then passes it to callIssuePage

module.exports = function callTopic(link) {

    function getIssuePageLinks(htmlData){
        const $ = cheerio.load(htmlData);

        const allIssuesLink = $('.border.rounded.color-shadow-small.color-bg-subtle.my-4 nav li a[data-ga-click="Explore, go to repository issues, location:explore feed"]');
        const allIssuesRepoName = $('h3.f3.color-fg-muted.text-normal.lh-condensed a.text-bold');
        const topicName = $($('h1.h1')).text().trim();

        fs.mkdirSync(`${topicName}`);

        for(let i=0; i<8; ++i) {
            const repoName = $(allIssuesRepoName[i]).text().trim();
            const filePath = `${topicName}/${repoName}.json`;
            
            fs.openSync(filePath, 'w');

            callIssuePage(filePath, 'https://github.com' + $(allIssuesLink[i]).attr('href'));
        }
    }

    request(link, function(err, response, htmlData) {
        if(err) {
            console.log(err);
        } else {
            getIssuePageLinks(htmlData);
        }
    });

}