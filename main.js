const express = require("express");
const cheerio = require("cheerio");

const cyrillicToTranslit = require("cyrillic-to-translit-js");
const request = require("request");
const rp = require("request-promise");

const vk_bot = require("node-vk-bot-api");
const body_parser = require("body-parser");

const port = 5000;
const app = express();
//const server = require("http").createServer(app);
app.use(body_parser.json());

const token = "c91edbf6f82d191d97fc7dcbad0898d34e6f28daa30f0a5a1b82f62e86ae22cdae14ae6e8b7b3fc0f8143";
const code = "8a06cc08";
const bot = new vk_bot({
   token: token,
   confirmation: code
});


app.post("/", bot.webhookCallback);

bot.command("/start", (ctx)=>{
   ctx.reply("Привет! Введите название города!")
});

bot.on((ctx)=>{
    let city = ctx.message.text;

    city = cyrillicToTranslit().transform(city.replace("-", " "), "_");
    console.log(city);
    const url = `https://pogoda.mail.ru/prognoz/${city}`;

    rp(url)
        .then(function(html){
            const $ = cheerio.load(html);
            let data = [];
            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div').each((idx, elem)=>{
                const title = $(elem).text();
                data.push(title);

            });

            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_temperature > div.information__content__temperature').each((idx,  elem)=>{
                const title = $(elem).text();
                data.push(title);
            });


            ctx.reply(data.join(" "));
        })
        .catch(function (err){
            ctx.reply("Неизвестный город");
            console.log(err);
        })

});


app.get('/get/:city', (req, res)=> {
    let city = req.params.city;
    city = cyrillicToTranslit().transform(city, "_");
    const url = `https://pogoda.mail.ru/prognoz/${city}`;

    rp(url)
        .then(function(html){
            const $ = cheerio.load(html);
            let data = [];
            $('body > div.g-layout.layout.layout_banner-side.js-module > div:nth-child(2) > div.block.block_forecast.block_index.forecast-rb-bg > div > div.information.block.js-city_one > div.information__content > div.information__content__wrapper.information__content__wrapper_left > a > div.information__content__additional.information__content__additional_first > div').each((idx, elem)=>{
                const title = $(elem).text();
                data.push(title);

            });
            res.send(data);

        })
        .catch(function (err){
            //error
            console.log(err);
        })
});


app.listen(port, function (){
    console.log(`Listening on port ${port}`);
});
