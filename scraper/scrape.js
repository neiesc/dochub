define(['path', 'fs'], function(path, fs) {
  
  var output_file = 'default.json';
  var rootUrls = [];
  var lst_black = [];
  var result = [];
  var isValid = true;
  
  function ScrapeException(message) {
    this.message = message;
    this.name = "ScrapeException";
    this.isValid = false;
  }
  
  var exitProcessDone = function(_filename) {    
    if (this.isValid) {
      // file where we'll dump the json
      console.log(this.output_file);
      var filename = path.dirname(_filename) + '/' + this.output_file;
      console.log('Scrape:', 'Dumping to ' + filename + '');
      var file = fs.openSync(filename, 'w');
      fs.writeSync(file, JSON.stringify(this.result, null, '\t'));
      console.log('Scrape:', 'DONE');
    }
    else {
      console.log('Scrape:', 'DONE, not valid');
    }
  }

  return {
    output_file: output_file,
    rootUrls: rootUrls,
    lst_black: lst_black,
    result: result,
    isValid: isValid,
    ScrapeException: ScrapeException,
    exitProcessDone: exitProcessDone
  }
});