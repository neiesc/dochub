define(["jQuery","Underscore","Backbone","models/pageelement"],function(a,b,c,d){var e=c.Collection.extend({model:d,comparator:function(a){return a.get("lowerCaseTitle")}});return e})