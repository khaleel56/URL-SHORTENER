const express = require('express');
const mongoose = require('mongoose')

require('dotenv').config();
const ShortUrl = require('./models/shortUrl')

const app = new express();
const port = process.env.PORT;

mongoose.set('strictQuery', true)

mongoose.connect('mongodb://localhost:27017/urls', 
    {    useNewUrlParser: true, 
        useUnifiedTopology: true,
        family: 4,},
    (err)=>{
        if(!err) console.log('connected to DB')
        else console.log(err)
    })


app.use(express.urlencoded({extended:false}))


 app.set('view engine', 'ejs')

app.get('/', async (req, res)=>{
    const shortUrls = await ShortUrl.find()
     res.render('index', {shortUrls:shortUrls})
})

app.post('/shortUrls', async (req, res)=>{
    await ShortUrl.create({full:req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl == null) res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save();
    res.redirect(shortUrl.full)
})

app.listen(port, ()=>console.log('server runnin on http://localhost:5000'))