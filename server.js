const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');


const locatURI = "mongodb://localhost/populatedb";
if( process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
} else {
    mongoose.connect(locatURI)
}

const db = require('./models');
 
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
    db.Article.find({'wanted': false }).then((result) => {
        if (result.length > 0) {
            res.render('home', { result: result })
        } else {
            res.render('home', { noFound: true })
        }
    })
})

// Save route is to update articles as saved and to present the saved articles only
app.put('/save/:id', (req, res) => {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { 'wanted': true }, { new: true }, (err, respo) => {
        if (err) {
            console.log(err)
        }
        console.log(respo)
    })
})

app.get('/save', (req, res) => {
    db.Article.find({ 'wanted': true }, (err, saveArticle) => {
        if (saveArticle.length > 0) {
            res.render('save', { result: saveArticle })
        } else {
            res.render('save', { noFound: true })
        }
    })
})

// delete saved article
app.get('/delete/:id', (req, res) => {
    db.Article.findOneAndDelete({ _id: req.params.id }, (err, done) => {
        if (err) {
            console.log(err)
        }
    })
})

// clear route will delete all articles from db
app.get('/clear', (req, res) => {
    db.Article.deleteMany({}, (err, data) => {
        if (err) {
            console.log(err)
        }
        res.json(data)
    })
})

// Scrape new articles
app.get('/scrape', async (req, res) => {
    await Store();
})

// note route is specific to each saved article
app.get('/note/:id', (req, res) => {
    db.Article.find({ _id: req.params.id })
        .populate("notes")
        .then(function (data) {
            if (data[0].notes.length > 0) {
                res.render('notes', { note: data[0].notes, id: req.params.id })
            } else {
                console.log('here in else')
                res.render('notes', { noNote: true, id: req.params.id })
            }
        })
        .catch(function (err) {
            res.json(err);
        });
})

app.post('/note', (req, res) => {
    db.Note.create({ msg: req.body.msg })
        .then((notedata) => {
            db.Article.findOneAndUpdate({ _id: req.body.id }, { $push: { notes: notedata._id } }, { new: true }, (err, data) => {
                if (err) {
                    console.log(err)
                }
                console.log(data)
            })
        })

})


app.delete('/note', (req, res) => {
    db.Note.findByIdAndDelete({ _id: req.body.id }, (err, doc) => {
        if (err) throw err
    })
})

app.listen(PORT, () => {
    console.log(`App is listing on port ${PORT}`)
})