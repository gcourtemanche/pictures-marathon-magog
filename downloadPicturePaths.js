const unirest = require('unirest');
const fs = require('fs');

const pathsFilePath = './picturePaths.json';

function fetchPage(pageNumber) {
  const promise = new Promise(resolve => {
    const req = unirest(
      'GET',
      'https://courirenestriecom.pixieset.com/client/loadphotos/',
    );

    req.query({
      cuk: 'marathondemagog2017',
      cid: '9294501',
      gs: 'marathondemagog29octobre2017',
      fk: '',
      page: pageNumber.toString(),
    });

    req.headers({
      'Postman-Token': '9458c659-ae7d-448a-820e-8006d5ff6cb1',
      'Cache-Control': 'no-cache',
      'x-requested-with': 'XMLHttpRequest',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36',
      referer: 'https://courirenestriecom.pixieset.com/marathondemagog2017/',
      cookie:
        '__cfduid=d73f5d9382fa7e56208ad9fcc220fcf551530398258; PHPSESSID=a7mbsjsnkafku0fld0vdkbrm62; __utma=96428430.2139061917.1530398262.1530398262.1530398262.1; __utmc=96428430; __utmz=96428430.1530398262.1.1.utmcsr=facebook.com|utmccn=(referral)|utmcmd=referral|utmcct=/; sso_id=90; cookie_consent=allow; __utma=181809574.67909155.1530398410.1530398410.1530398410.1; __utmc=181809574; __utmz=181809574.1530398410.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmb=181809574.1.10.1530398410; __utmt=1; __utmb=96428430.18.10.1530398262',
      'accept-language': 'en-US,en;q=0.9,fr;q=0.8',
      'accept-encoding': 'gzip, deflate, br',
      accept: '*/*',
    });

    req.send();

    req.end(res => {
      if (res.error) throw new Error(res.error);

      resolve(res.body);
    });
  });

  promise.then(({ content, isLastPage }) => {
    console.log(`Page ${pageNumber}, isLastPage: ${isLastPage}`);

    const paths = JSON.parse(content).map(({ pathLarge, pathXxlarge }) => {
      return { pageNumber, pathLarge, pathXxlarge };
    });

    fs.appendFileSync(pathsFilePath, JSON.stringify(paths) + ',');

    if (!isLastPage) fetchPage(++pageNumber);
  });
}

fs.appendFileSync(pathsFilePath, '[');
fetchPage(0);
fs.appendFileSync(pathsFilePath, ']');
