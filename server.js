const express = require('express');
const app = express();

const port = 3000;
var server = require('http').createServer(app);

app.use(
    express.urlencoded({
        extended:true
    })
);

app.use(express.static('public'));

app.get('/scoring', function(req, res) {
    res.sendFile('public/index.html')
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

app.post('/scoring', (req, res)=> {
	console.log(req.body);
    let client_score = parseJson(req.body);
    if (client_score > 1.25) {
        res.send('Вам одобрен кредит!');
    } else {
        res.send('К сожалению вам отказано в выдаче кредита!');
}
});

server.listen(port, function(){
    console.log('listening on 3000');
})