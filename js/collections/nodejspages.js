define(["jQuery","Underscore","Backbone","models/sectionscrape"],function(a,b,c,d){var e=c.Collection.extend({url:"data/nodejs.json",model:d,comparator:function(a){return a.get("title")}});return e})