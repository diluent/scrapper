const puppeteer = require("puppeteer");
const chalk = require("chalk");
const fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

const catalogSrc = 'https://www.avito.ru/moskovskaya_oblast/doma_dachi_kottedzhi/sdam/na_dlitelnyy_srok-ASgBAgICAkSUA9IQoAjIVQ?pmax=70000&pmin=30000&f=ASgBAQICAkSUA9IQoAjIVQFA2ghE0lnUWdhZ1lk';

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    
    // await page.goto(link);
    // await page.waitForSelector("a.snippet-link");
    
    const links = await getCatalogAdvList(browser, catalogSrc);

    // var news = await page.evaluate(() => {
    //   var titleNodeList = document.querySelectorAll(`a.storylink`);
    //   var ageList = document.querySelectorAll(`span.age`);
    //   var scoreList = document.querySelectorAll(`span.score`);
    //   var titleLinkArray = [];
    //   for (var i = 0; i < titleNodeList.length; i++) {
    //     titleLinkArray[i] = {
    //       title: titleNodeList[i].innerText.trim(),
    //       link: titleNodeList[i].getAttribute("href"),
    //       age: ageList[i].innerText.trim(),
    //       score: scoreList[i].innerText.trim()
    //     };
    //   }
    //   return titleLinkArray;
    // });
    console.log(links);

    // const advList = [];
    // for(let i = 0; i < i < links.length; i++) {
    //     const adv = await parseAdv(browser, links[i]);
    //     advList.push(adv);
    // }



    await browser.close();
    fs.writeFile("houses.json", JSON.stringify(links), function(err) {
      if (err) throw err;
      console.log("Saved!");
    });
    console.log(success("Browser Closed"));
  } catch (err) {
    console.log(error(err));
    if (browser) {
        await browser.close();
    }
    console.log(error("Browser Closed"));
  }
})();

async function getCatalogLinks(browser, src) {
    const page = await browser.newPage();
    
    await page.goto(src);
    await page.waitForSelector("a.snippet-link");
    
    const links = await page.evaluate(() => {
        const titleLinkList = document.querySelectorAll('.snippet-link');
        const l = [];
        for (let i = 0; i < titleLinkList.length; i++) {
            l.push(titleLinkList[i].toString());
        }
        return l;
    });

    return links;
}


async function getCatalogAdvList(browser, src) {
    const page = await browser.newPage();
    
    await page.goto(src);
    await page.waitForSelector(".snippet-list");
    
    const links = await page.evaluate(() => {
        const items = document.querySelectorAll('.item');

        const l = [];
        for (let i = 0; i < items.length; i++) {
            const link = items[i].querySelector('.snippet-link').toString();
            const price = items[i].querySelector('.snippet-price').innerHTML.replace(/\D/g, '');
            const date = items[i].querySelector('.snippet-date-info').getAttribute('data-tooltip');
            const image = items[i].querySelector('.item-photo ');//.src;

            // querySelectorAll array
            // querySelector first item
            
            l.push({
                link,
                price,
                date,
                image,
            });
        }
        return l;
    });

    return links;
}

async function parseAdv(browser, link) {
    const page = await browser.newPage();
    
    await page.goto(src);
    
    await page.waitForSelector("span.snippet-price");

    const links = await page.evaluate(() => {
        
    });
}