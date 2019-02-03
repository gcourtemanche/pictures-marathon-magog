const http = require('http');
const fs = require('fs');
const pages = require('./picturePaths.json');

const pageStart = 1068;
const pageEnd = pages.length;
const fileType = 'pathLarge';
// const fileType = 'pathXxlarge';
const sleepTimeBetweenPages = 5000;

const createFolder = path => {
  try {
    fs.mkdirSync(path);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

const downloadPage = (page, pageIndex) => {
  page.forEach((picture, pictureIndex) => {
    const file = fs.createWriteStream(
      `./images/page${pageIndex}-picture${pictureIndex}.jpg`,
    );
    http.get(`http:${picture[fileType]}`, response => {
      response.pipe(file);
    });
  });
};

const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

(async () => {
  createFolder('images');
  for (let i = pageStart; i < pageEnd; i += 1) {
    const page = pages[i];
    const pageIndex = i;
    downloadPage(page, pageIndex);
    await sleep(sleepTimeBetweenPages);
  }
})();
