const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const server = require('http').createServer(app);

app.get('/', (req, res)=>{
  res.sendFile('C:/Users/IlyaP/Desktop/service/frontcurpi192/index.html')
});



app.get('/get/:val', (req, res)=>{

  let options = {
  method: 'get',
  uri: 'https://www.cbr-xml-daily.ru/daily_json.js',
  json: true
};

  //console.log(req.params.val);
  let response = null;
  new Promise(async(resolve, reject)=>{
    try{
      response = await axios('https://www.cbr-xml-daily.ru/daily_json.js');
    } catch (er){
      response = null;
      //console.log(er);
      //reject(er);
    }
    if (response){
      let json = response.data;
      let value=json['Valute'][req.params.val]['Value'];
      console.log(value);
      //console.log(json);
      //resolve(json);
      res.send({"value":value});
    }
  });
  
});

server.listen(port, function(){
  console.log(`Listening on port ${port}`);
})