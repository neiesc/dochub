define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  // Handle the following cases:
  //  -xyz
  //  ::-xyz
  //  ::xyz
  //  :xyz
  //  @xyz
  //  <xyz>
  var apiPropsPattern = new RegExp("^(\\W*)(.+)$");

  var MozDevAPIProps = Backbone.Collection.extend({
    url: 'data/webapi-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      var title = model.get('title');
      var results = apiPropsPattern.exec(title);
      var prefix = results[1];
      var name   = results[2];

      if (prefix) {
        return '2' + title;
      } else if (name[0] === name[0].toLowerCase()) {
        return '0' + name;
      } else {
        return '1' + name;
      }
    },

  });

  return MozDevAPIProps;
});
