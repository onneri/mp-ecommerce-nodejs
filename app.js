var express = require('express');
var exphbs  = require('express-handlebars');
const mercadopago = require('mercadopago');
 
var app = express();
 
mercadopago.configure({
  access_token: 'APP_USR-3549276489958909-043013-910acd29c22a177ffc9fd42f94bbe688-446898992'
});
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
  const { title, price:unit_price, unit:quantity, img } = req.query;
  let preference = {
    items: [
      {
        title,
        unit_price: parseInt(unit_price),
        quantity: parseInt(quantity),
        description: 'Dispositivo móvil de tienda e-commerce',
        picture_url: img.replace('./', 'https://neri.ngrok.io/')
      }
    ],
    payer :{
      name: "Lalo",
      surname: "Landa",
      email: "test_user_58295862@testuser.com",
      phone: {
        area_code: "",
        number: 5549737300
      },
      address: {
        street_name: "Insurgentes Sur",
        street_number: 1602,
        zip_code: "03940"
      }
    },
    external_reference: 'ABCD1234',
    payment_methods: {
      excluded_payment_methods:[
          {"id":"amex"}
      ],
      excluded_payment_types:[
        {"id":"atm"}
      ],
      installments: 6
    },
    back_urls: {
      "success": "https://neri.ngrok.io/payments/success",
      "failure": "https://neri.ngrok.io/payments/failure",
      "pending": "https://neri.ngrok.io/payments/pending"
    },
    auto_return: "approved",
    notification_url: "https://neri.ngrok.io/notifications"
  };
  mercadopago.preferences.create(preference)
  .then(function(response){
    res.render('detail', {...req.query, preferenceId: response.body.id});
  }).catch(function(error){
    console.log('error creating preference', error);
  });
    
});


app.post('/notifications', (req, res) => {
  console.log('notification query', req.query);
  res.status(200).send(req.query);
})

app.post('/payments/success', (req,res) => {
  res.send('payment success')
})
app.post('/payments/pending', (req,res) => {
  res.send('payment failure')
})
app.post('/payments/failure', (req,res) => {
  res.send('payment failure')
})

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
app.listen(3000, () => {
  console.log('server running at port:' + 3000);
});