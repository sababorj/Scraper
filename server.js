const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models')

const PORT = 3000 || process.env.PORT;

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engins', 'handlebars');

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

axios.get('https://www.nytimes.com/').then((response) => {
    const $ = cheerio.load(response.data);
    
    $('article').each((i,elem)=> {
        let articleObj = {
        link : `https://www.nytimes.com${$(elem).find('a').attr('href')}`,
        title : $(elem).find('h2'||'h3').text(),
        sum : $(elem).find('p').text()
        }
        console.log(articleObj.sum.length)
    })

}).catch((err) => {
    console.log(err)
})

app.listen(PORT, () => {
    console.log(`App is listing on port ${PORT}`)
})