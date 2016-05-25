var express = require('express');
var fs = require('fs');
var app = express();
var pg = require ('pg');
var bodyParser = require('body-parser')



app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(express.static(__dirname + '/views'));

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/allmessage', function(request, response) {
  pg.connect(connectionString, function (err, client, done) {
    if (err) {
      if (client) {
        done(client);
      }
    }
    client.query('select * from messages', function (err, result) {
      if (err) {
        if (client) {
          done(client);
          return;
        } else {
          done();
        }
      }
      response.render('msgpage', {
        messages: result.rows
      });
    });
    
  });
});

app.get('/postnewmessage', function (req, res) {
	res.render('form');
});

app.post('/postnewmessage', function (req, res) {
  pg.connect(connectionString, function (err, client, done) {
    client.query('insert into messages (title, body) values ($1, $2)', [req.body.msgtitle, req.body.newmessage], function (err) {
      if(err) {
        throw err;
      }

      done();
      pg.end();
      res.redirect('allmessage');
    });
  });

});
// app.post('/postnewmessage', function (req, res) {
//   var pagetitle = req.body.title;
//   var pagemsg = req.body.newmessage;
//   pg.connect(connectionString, function (err, client, done) {
//     if (err) {
//       if (client) {
//         done(client);
//       }
//     }
//     client.query('select * from messages', function (err, result) {
//       if (err) {
//         if (client) {
//           done(client);
//           return;
//         } else {
//           done();
//         }

//       }
//     });
//   });
// });


app.listen(3000)