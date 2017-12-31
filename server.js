const http = require('http');
const app = require('./app');

//Creating Server by passing app module
const server = http.createServer(app);
//setting to server to listen on port no. 3000
server.listen(3000, ()=>{
  console.log('server started on port 3000');
});
