const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const db = require('./models');

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/NYScrapeDB', { useNewUrlParser: true })
const PORT = 3000 || process.env.PORT;

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// store data is our DB
function Store() {
    axios.get('https://www.nytimes.com/').then((response) => {
        const $ = cheerio.load(response.data);
        $('article').each((i, elem) => {
            let articleObj = {
                link: `https://www.nytimes.com${$(elem).find('a').attr('href')}`,
                title: $(elem).find('h2' || 'h3').text(),
                sum: $(elem).find('p').text()
            }
            db.Article.create(articleObj).then((data) => {
            }).catch((err) => {
            })
        })
    }).catch((err) => {
        console.log(err)
    })
}

Store();

// home route shows all articles stored
app.get('/', (req, res) => {
    db.Article.find({'wanted':false}).then((result) => {
        res.render('home', { result: result , home: true})
    })
})

// Save route is to update articles as saved and to present the saved articles only
app.put('/save/:id', (req, res) => {
    db.Article.findOneAndUpdate({_id : req.params.id},{'wanted': true}, {new: true}, (err, respo)=> {
        if (err){
            console.log(err)
        }
        console.log(respo)
    })
})

app.get('/save', (req,res)=> {
    db.Article.find({'wanted':true}, (err, saveArticle) => {
        res.render('home', {result: saveArticle , home: false})
    })
})

//
app.listen(PORT, () => {
    console.log(`App is listing on port ${PORT}`)
})