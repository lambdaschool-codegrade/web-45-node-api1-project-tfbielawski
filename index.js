const server = require('./api/server.js');

// START YOUR SERVER HERE
//Server listen function, listening on port 5000
server.listen(5000, () => {
    console.log('listening on port 5000'); // success callback
})

