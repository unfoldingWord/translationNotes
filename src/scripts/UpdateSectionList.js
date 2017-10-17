var fs = require('fs');
var SectionList = require('../static/SectionList.json');
var files = fs.readdirSync('./notes');
for (var file of files) {
  var fileToMd = file.split('.')[0] + '.md';
  if (!SectionList.sectionList[fileToMd]) continue;
  var contents = fs.readFileSync('./notes/' + file).toString();
  SectionList.sectionList[fileToMd] = {};
  SectionList.sectionList[fileToMd].file = contents;
}
fs.writeFileSync('../static/SectionList.json', JSON.stringify(SectionList, null, 2));
