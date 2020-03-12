const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('../utils/geocode');
const forecast = require('../utils/forecast');

const app = express();

const port = process.env.PORT || 3000;

const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// register static files
app.use(express.static('public'));

// setup handlebars views and view engine
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.get('', (req, res) => {
  res.render('index', { title: 'Weather', name: 'Cjay' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About', name: 'Cjay' });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help ',
    name: 'Cjay',
    message: 'Useful links for help are available'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({ error: 'Please provide an address' });
  }

  const { address } = req.query;

  geocode(address, (error, { longitude, latitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(latitude, longitude, (error, forecast) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        forecast,
        location,
        address: req.query.address
      });
    });
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', { message: 'Help Article Not Found', name: 'Cjay' });
});

app.get('*', (req, res) => {
  res.render('404', { message: 'Page Not Found', name: 'Cjay' });
});

// listen to server
app.listen(port, () => console.log(`server is up on port ${port}`));
