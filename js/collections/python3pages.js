define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  var Python3Pages = Backbone.Collection.extend({
    url: '/data/python3.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title');
    },

  });

  return Python3Pages;
});
