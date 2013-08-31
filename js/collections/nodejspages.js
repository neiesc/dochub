define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  var NodejsPages = Backbone.Collection.extend({
    url: 'data/nodejs.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title');
    },

  });

  return NodejsPages;
});
