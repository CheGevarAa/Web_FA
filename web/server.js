const express = require('express');
const app = express();

const port = 3000;
var server = require('http').createServer(app);

app.use(
    express.urlencoded({
        extended:true
    })
);

const MongoClient = require("mongodb").MongoClient;

app.use(express.static('public'));

app.get('/scoring', function(req, res) {
    res.sendFile('C:/Users/IlyaP/web/Desktop/public/index.html')
});


function parseJson(json) {
    let score = 0;

    if (json.gender = "female") {
        score += 0.4;
    } else {
        score += 0;
    }

    let current = new Date()
    let birth_date = new Date(json.birthdate)
    let age = Math.trunc((current.getTime() - birth_date) / (24 * 3600 * 365.25 * 1000));

    if ((age - 20) * 0.1 <= 0.3) {
        score += (age - 20) * 0.1;
    } else {
        score += 0.3
    }

    if (json.period * 0.042 <= 0.42) {
        score += json.period * 0.042;
    } else {
        score += 0.42;
    }

    if ("manager_teacher_developer".includes(json.professional)) {
        score += 0.55;
    } else if ("policeman_judge_driver_pilot".includes(json.professional)) {
        score += 0;
    } else {
        score += 0.16;
    }

    if (json.bankAcc) {
        score += 0.45;
    }
    if (json.realestate) {
        score += 0.35;
    }
    if (json.insurance) {
        score += 0.19;
    }

    if (json.sphere = "public") {
        score += 0.21;
    }

    score += json.work * 0.059

    console.log("SCORE = ", score)

    return score;
};

server.listen(port, function(){
    console.log('listening on 3000');
})

app.post('/scoring', (req, res)=> {
	console.log(req.body);
    let client_score = parseJson(req.body);

    const url = "mongodb://localhost:3001/";
    const client = new MongoClient(url);
    client.connect(function(err, client){
        const db = client.db('clients');
        const collection = db.collection("info");
        let client_info = req.body;
        collection.insertOne(client_info, function(err,result) {
            if (err) {
                return console.log(err);
            }
            console.log(result);
            console.log(client_info);
            client.close();
        });
    });

    if (client_score > 1.25) {
        res.send('Вам одобрен кредит!');
    } else {
        res.send('К сожалению вам отказано в выдаче кредита!');
}
});


app.post('/email', function(req, res) {

    const url = "mongodb://localhost:3001/";
    const client = new MongoClient(url);
    let email = req.body.email;

    client.connect(function(err, client) {
        const db = client.db('clients');
        const collection = db.collection('info');

        collection.findOne({ "email": email }, { _id: 0 }, function(err, result) {
            if (err) throw err;
            res.send(`
            <head>
                <meta charset="UTF-8">
                <title>Результаты</title>
            </head>
            <body>
            <form  action="http://localhost:3000/scoring" method="GET">
                <h3>Результат поиска клиента ${result.email}:</h3>  <br>
                <textarea style="width:700px; height:200px; resize: none;">${JSON.stringify(result)}</textarea> <br> <br>
                <input type="submit" value="Вернуться к скорингу">
            </form>
            </body>`)
            client.close();
        })
    });

});