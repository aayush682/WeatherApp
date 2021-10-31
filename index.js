const http = require("http");
const fs = require("fs");
var requests = require('requests');
const fileName = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].country);
    return temperature;
};
const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Kolkata&units=metric&appid=05d22a4f1e0d490446e5879abf8b9976')
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                // console.log(arrdata[0].main.temp);
                const realtimedata = arrdata.map((val) => replaceVal(fileName, val)).join("");
                res.write(realtimedata);
                console.log(realtimedata);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                console.log('end');
            });
    }
});

server.listen(8000, '127.0.0.1');