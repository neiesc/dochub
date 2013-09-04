var requirejs = require('requirejs');

requirejs([
  'spider',
  'underscore',
  'cheerio',
  '../models/sectionscrape',
  './scrape'
], function(spider, _, cheerio, SectionScrape, scrape) {
  /*#### config ####
   From:
   http://docs.python.org/3.3/library/
  */
  scrape.output_file = 'python3.json';
  scrape.rootUrls.push('http://docs.python.org/3.3/library/');
  scrape.lst_black = ['#'];

  var spidey = spider();
  
  /*** Functions internal ***/  
  var visitLinks = function($, url, selectLink) {
    $(selectLink).each(function() {
      var href = $(this).attr('href');
      spidey.get(url + href);
    });
  }
  
  spidey.route('docs.python.org', '/3.3/library/', function ($, url) {
    console.log('Scrape:', 'scraping:', url);
    visitLinks($, url, 'li.toctree-l1 a.reference');
  });

  spidey.route('docs.python.org', '/3.3/library/*.html', function ($, url) {
    /*** Validation and testing. ***/
    if (!$('.section')[0]) { throw new scrape.ScrapeException("No sections..."); }
    if (_.include(scrape.lst_black, url)) { return; }
    
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
    if (scrapeData.url.length === 0) { scrape.isValid = false; }
    if (scrapeData.title.length === 0) { scrape.isValid = false; }
    if (scrapeData.sectionNames.length === 0) { scrape.isValid = false; }
    if (scrapeData.sectionHTMLs.length === 0) { scrape.isValid = false; }
    if (!scrape.isValid) { throw new scrape.ScrapeException("Content with zero length"); }
    
    scrape.result.push(scrapeData.toJSON()); 
    scrape.lst_black.push(url);
  });

  // Start 'er up
  _.each(scrape.rootUrls, function(url) {
    spidey.get(url).log('info');
  });

  process.on('exit', function () {
    scrape.exitProcessDone(__filename);
  });
  
  return;
});

