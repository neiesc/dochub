define([], function(){
  var Settings = {
    languages: [
      { lang: 'css', name: 'CSS' },
      { lang: 'html', name: 'HTML' },
      { lang: 'javascript', name: 'JavaScript' },
      { lang: 'dom', name: 'DOM' },
      { lang: 'jquery', name: 'jQuery' },
      { lang: 'php', name: 'PHP' },
      { lang: 'python', name: 'Python' },
      { lang: 'python3', name: 'Python3' },
      { lang: 'nodejs', name: 'Node.js' }
    ]
  }
  
  Settings.languages.sort(function(a, b){
    var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
    //sort string ascending
    if (nameA < nameB) { return -1 }
    if (nameA > nameB) { return 1 }
    return 0 //default return value (no sorting)
  });
  
  return Settings;
});
