const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const callTopic = require('./callTopic.js');
const url = 'https://github.com/topics';

// Extracts the topic links from the main page and then passes the links to callTopic
// which calls those topic page
function extractTopicLinks(htmlData) {
    const $ = cheerio.load(htmlData);

    const topicLinks = $('.topic-box a');

    for(let i=0; i<topicLinks.length; ++i) {
        callTopic('https://github.com/' + $(topicLinks[i]).attr('href'));
    }

}

request(url, function(err, response, htmlData) {
    if(err) {
        console.log(err);
    } else {
        extractTopicLinks(htmlData);
    }
});
