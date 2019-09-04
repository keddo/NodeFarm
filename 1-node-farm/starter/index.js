const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const templateOverview = fs.readFileSync(`${__dirname }/templates/template-overview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname }/templates/template-card.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname }/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, {
    lower: true
}));
console.log(slugs)


const server = http.createServer((req, res) => {
    const {
        query,
        pathname
    } = url.parse(req.url, true);
    //OVERVIEW Page
    if (pathname === '/overview' || pathname === '/') {
        res.writeHead('200', {
            'Content-type': 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }
    //PRODUCT Page
    else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(templateProduct, product);
        res.writeHead('200', {
            'Content-type': 'text/html'
        });
        res.end(output)
    }
    //API
    else if (pathname === '/api') {
        res.writeHead('200', {
            'Content-type': 'application/json'
        });
        res.end(data);
    }
    //Not found
    else {
        res.writeHeader('404', {
            'Content-type': 'text/html',
            'My-header': 'Header'
        });
        res.end("Page not found");
    }
});

server.listen(8000, () => {
    console.log('Your server is running on port 8000');
})