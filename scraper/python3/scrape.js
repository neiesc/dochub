var requirejs = require('requirejs');

requirejs([
  'spider',
  'underscore',
  'cheerio',
  '../../models/sectionscrape',
  'path',
  'fs'
], function(spider, _, cheerio, SectionScrape, path, fs) {
  /*#### config ####
   From:
   http://docs.python.org/3.3/reference/
   http://docs.python.org/3.3/library/
  */
  var output_json = 'python3.json';
  
  var rootUrls = [
    'http://docs.python.org/3.3/reference/',
    'http://docs.python.org/3.3/library/',
  ];
  
  var lst_black = ['#'];
  var lst_titles = [];

  var result = [];
  var _valid = true;
  var spidey = spider();
  
  /*** Functions internal ***/
  function ScrapeException(message) {
      this.message = message;
      this.name = "ScrapeException";
      _valid = false;
  }
  
  var visitLinks = function($, selectLink) {
    $(selectLink).each(function() {
      var href = $(this).attr('href');
      spidey.get('http://docs.python.org/3.3/library/' + href); //TODO: alter to dynamic
    });
  }

  spidey.route('docs.python.org', '/3.3/reference/', function ($, url) {
    console.log('Scrape:', 'Skipping ' + url);
  });
  
  spidey.route('docs.python.org', '/3.3/library/', function ($, url) {
    console.log('Scrape:', 'scraping:', url);
    visitLinks($, 'a.reference');
  });

  spidey.route('docs.python.org', '/3.3/library/*.html', function ($, url) {
    console.log(url);
    /*** Validation and testing. ***/
    if (!$('.section')[0]) { throw new ScrapeException("No sections..."); }
    if (_.include(lst_black, url)) { return; }
    
    /*** Populating data ***/
    var scrapeData = new SectionScrape({ url: url, title: '', sectionNames: [], sectionHTMLs: [] });
    
    $('.section .headerlink').remove(); //Fix: headerlink all visible remove
    var title = $('.section > h1').text().trim();
    scrapeData.title = title;
    
    /*** ##sectionNames ***/
    scrapeData.sectionNames.push($('.section').attr('id'));
    
    /*** ##sectionHTMLs ***/
    $('.section > h1').remove();
    scrapeData.sectionHTMLs.push($('.section').html());    
    
    /*** Validation Content with zero length ***/
    if (scrapeData.url.length === 0) { _valid = false; }
    if (scrapeData.title.length === 0) { _valid = false; }
    if (scrapeData.sectionNames.length === 0) { _valid = false; }
    if (scrapeData.sectionHTMLs.length === 0) { _valid = false; }
    if (!_valid) { throw new ScrapeException("Content with zero length"); }
    
    result.push(scrapeData.toJSON()); 
    lst_titles.push(scrapeData.title);
    lst_black.push(url);
  });

  // Start 'er up
  _.each(rootUrls, function(url) {
    spidey.get(url).log('info');
  });

  process.on('exit', function () {
    if (_valid) {
      // file where we'll dump the json
      var filename = path.dirname(__filename) + '/../../static/data/' + output_json;
      console.log('Scrape:', 'Dumping to ' + filename + '');
      var file = fs.openSync(filename, 'w');
      fs.writeSync(file, JSON.stringify(result, null, '\t'));
      console.log('Scrape:', 'DONE');
    }
    else {
      console.log('Scrape:', 'DONE, not valid');
    }
  });
  
  return;
});

