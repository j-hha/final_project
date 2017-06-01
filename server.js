const express = require('express'),
      app     = express(),
      port    = process.env.PORT || 8000;

app.use(express.static('public'));

app.get('*', (req, res) => res.redirect('/'));

app.listen(port, () => console.log('coffee app listening at port ' + port));
