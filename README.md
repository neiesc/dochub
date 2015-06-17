DocHub - speedy docs
======================
[![Build Status](https://travis-ci.org/neiesc/dochub.png?branch=master)](https://travis-ci.org/neiesc/dochub) [![Dependency Status](https://gemnasium.com/neiesc/dochub.png)](https://gemnasium.com/neiesc/dochub) 

## Usage
[DocHub](http://edineisc.com.br/dochub/) on GitHub Pages
#### Running locally
[Docker repositories](https://registry.hub.docker.com/u/mildred/dochub/) or manual

* Download de [docfiles](https://github.com/neiesc/dochub/tree/gh-pages) `*.json` and paste in `static/data`

* Run the server:

        npm install --production # downloads dependencies for web server or npm install for all dependencies
        npm start

* Open `http://localhost:5000/` in your browser.

## Docfiles
Docfiles is de `*.json` docs for `static/data`. Currently contains docfiles:
* CSS/HTML/JavaScript/DOM data is from the [Mozilla Developer Network](https://developer.mozilla.org/).
* jQuery data is from [jQuery API](http://api.jquery.com). Version is 1.7.
* PHP data is from [PHP: Alphabetical - Manual](http://www.php.net/manual/en/extensions.alphabetical.php).
* Python 2.7 data is from [The Python Standard Library](http://docs.python.org/library/). Version is 2.7.
* Python 3 data is from [The Python Standard Library](http://docs.python.org/3.3/library/). Version is 3.3.2.
* Node.js data is from [Node.js Manual & Documentation](http://nodejs.org/api/). Version is 0.10.17.

## Scraper
The `static/data/` directory contains our scrape of the sites we get content from. Right now we don't update this very often. If you want the most up-to-date content, you can run the scrapers:

    npm install --dev # downloads dependencies for scrapers
    cd scraper
    node you-scrape.js

## Notes
* [CHANGELOG](CHANGELOG.md)
* How to use the `r.js` optimizer: `node node_modules/requirejs/bin/r.js -o static/js/app.build.js`, make sure the node server is serving the correct static folder (whether you want `/static` or `/static-build`).

## License
Licensed under the [GNU Affero General Public License](LICENSE).
