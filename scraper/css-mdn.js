var requirejs = require('requirejs');

requirejs([
  'spider',
  'underscore',
  'cheerio',
  '../models/sectionscrape',
  'path',
  'fs'
], function(spider, _, cheerio, SectionScrape, path, fs) {

  var results = [];

  var spidey = spider();

  // use this to visit all links on a page
  var visitLinks = function($) {
    $('a:not([class*=new])').each(function() {
      var href = $(this).attr('href');
      if (href && href.substr(0, 4) !== 'http') {
        href = 'https://developer.mozilla.org' + href;
      }
      if (href && href.indexOf('$') === -1 && href.indexOf('?') === -1 && /Web\/CSS/.exec(href.split('=')[0]) !== null) {
        spidey.get(href);
      }
    });
  };

  // file where we'll dump the json
  var filename = path.dirname(__filename) + '/../static/data/css-mdn.json';
  console.log('dumping to ' + filename);
  var file = fs.openSync(filename,'w');

  // main index of mdn's css docs
  spidey.route('developer.mozilla.org', '/en-US/docs/tag/CSS', function ($) {
    visitLinks($);
  });

  var blacklist = [
  ];

  // some urls redirect to other pages w/o changing the url (for example: https://developer.mozilla.org/en/CSS/-moz-scrollbars-none)
  // so in addition to not visiting the same url twice, keep this list to prevent visiting the same title twice
  var titles = [];

  spidey.route('developer.mozilla.org', /\/en\-US\/docs\/Web\/CSS\/*/, function ($, url) {
    if ( _.include(blacklist,url) ) return;
    visitLinks($);

    console.log('---------');
    console.log('scraping:',url);

    var title = $('h1').text().trim();
    if ( title === '' || title === null ) {
      console.log('ERROR: could not get title, skipping');
      return;
    } else if ( _.include(titles,title) ) {
      console.log('WARNING: already scraped something with this title, skipping');
      return;
    }

    console.log('title:',title);

    var scrapeData = new SectionScrape();
    scrapeData['title'] = title;
    scrapeData['url'] = url;
    scrapeData['sectionNames'] = [];
    scrapeData['sectionHTMLs'] = [];

    // get all section ids
    var ids = _.map($('article[id]'), function(div) { return div.attribs.id } );
    if ( ids.length === 0 ) {
      console.log('WARNING: no sections...');
      return;
    }

    for ( var i = 0; i < ids.length; i++ ) {
      // load the section html as its own jquery object
      var $section = cheerio.load($('[id^="' + ids[i] + '"]').html());

      // strip scripts
      $section('script').remove();
      var sectionName = "";

      // TODO find relative hrefs and turn them into absolute hrefs

      // find the title of the section--mdn isn't very consistent with what size headers they use
      _.each([1,2,3,4],function(h) {
        var headers = $section('h' + h);
        if ( sectionName === "" && headers.length > 0 ) {
          sectionName = headers.text();
        }
      });

      scrapeData['sectionNames'].push(sectionName);
      scrapeData['sectionHTMLs'].push($section.html());
    }

    results.push(scrapeData.toJSON());
    titles.push(title);
  });

  // start 'er up
  spidey.get('https://developer.mozilla.org/en-US/docs/tag/CSS').log('info');

  process.on('exit', function () {
    fs.writeSync(file,JSON.stringify(results,null,'\t'));
    console.log('DONE');
  });
  return;
});
