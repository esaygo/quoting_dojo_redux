module.exports = function(app){

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting_dojo');
var QuoteSchema = new mongoose.Schema({
  author: String,
  quote: String,
  likes: Number,
  created_at: {type: Date, default: Date.now}
});

QuoteSchema.path('author').required(true, 'Name cannot be lank');
QuoteSchema.path('quote').required(true, 'Quote cannot be lank');

mongoose.model('Quote', QuoteSchema);// setting this Schema in our Models as 'User'

var Quote = mongoose.model('Quote'); // retrieving this Schema from our Models, named User

  app.get('/', function (req,res) {
    //retrieve all users matching {}
    res.render('index');

  });

  // function getQuotes(req, res) {
  //   Quote.find({}, function(err, quotes) {
  //     if(err) {
  //       res.render('quotes', {message: "there was an error"});
  //
  //     } else {
  //       console.log("quotes list", quotes);
  //       res.render('quotes', {quotes: quotes});
  //     }
  //   });
  // }

  app.get('/quotes', function(req, res) {
    Quote.find({}, function(err, quotes) {
      if(err) {
        res.render('quotes', {message: "there was an error"});

      } else {
        //console.log("quotes list", quotes[0].id);
        var display_quotes = quotes;
        res.render('quotes', {quotes_list: display_quotes});
      }
    });

  });

  app.post('/quotes', function(req,res) {
    //console.log("POST DATA", req.body);
    var quote = new Quote({
                        author: req.body.author,
                        quote:  req.body.quote,
                        likes:  0
                      });

    quote.save(function(err) {
      if(err) {
        console.log(err);
        console.log('something went wrong');
        res.redirect('/');
      } else {
        console.log('successfully added a quote!');
        res.redirect('/quotes');
      }
    });

  });

  app.post('/likes', function(req, res) {
    //console.log("likes", req.body.id);
    var quote_id = req.body.id;
    console.log(quote_id);
    Quote.update({'_id': quote_id}, {$inc: {likes: 1}}, function(err, doc){
      if(err) {
        console.log(doc);
        console.log(err);
      } else {
        console.log(doc);
      }
    });

    res.redirect('/quotes');
  });

} //end of module.exports

//more examples od db queries:
// User.find({name: 'Jessica'}, function(err,users) {
  // Retrieve an array of users matching the name. Even if 1 record is found, the result will be an array the size of 1, with 1 object inside. (Notice, if we are expecting to retrieve one record, we may want to use findOne and retrieve the object as oppose to an array the size of one.
// })
// ...create a new instance of the User Schema and save it to the DB.
      // var userInstance = new User();
      // userInstance.name = 'Adriana';
      // userInstance.age = 29;
      // userInstance.save(function(err) {
      // });
// ...delete all records of the User Model
      // User.remove({}, function(err) {
      // });
// ...delete 1 record by a certain key/vaue.
      // User.remove({id: }, function(err){
      // });
// ...update any records that match the query
      // User.update({name: 'Adriana'}, {name: "Adrianna"}, function(err) {
      // });
