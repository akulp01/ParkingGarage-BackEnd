// necessary to know what commands to run, docker oriented or local instal oriented
const platform = (process.argv[2] == "OSX" && process.argv[2]) || "Windows"

// == MESSAGE TRANSACTION ==
const { sendToAllClients } = require('./socket')

// == DATABASE ==

var mysql = require('mysql');
var chokidar = require('chokidar');

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password"
})

function getRandomElement(arr, parked) {
    const unparkedElements = arr.filter(obj => obj.parked === (parked && 1 || 0));
    const randomIndex = Math.floor(Math.random() * unparkedElements.length);
    return unparkedElements[randomIndex];
}  

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("use garage", (err, result) => {
        if (err) throw err;

        // setInterval(() => {
        //     con.query("SELECT * FROM car_info", (err, result) => {
        //         if (err) throw err;
        //         let enteringCar = JSON.stringify(getRandomElement(result, false));
        //         sendToAllClients("message", enteringCar);
        //     });
        // }, 5000);

        // setTimeout(function() {
        //     setInterval(() => {
        //         con.query("SELECT * FROM car_info", (err, result) => {
        //             if (err) throw err;
        //             let enteringCar = JSON.stringify(getRandomElement(result, true));
        //             sendToAllClients("message", enteringCar);
        //         });
        //     }, 5000);
        // }, 2500);
    })
})

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// == PORT ==

const app = express();
const port = 8081;

app.use(bodyParser.json({ extended: true, limit: '10mb' }));
app.use(cors({ origin: 'http://localhost:3000' }));

app.post('/status', (req, res) => {
    console.log(req.body);

    res.end(
        JSON.stringify({ success: true })
    );
});

app.post('/getpermits', (req, res) => {
    con.query("SELECT * FROM permit_info", (err, result) => {
        if (err) throw err;
        // console.log(result);
        res.end(JSON.stringify(result))
    })
});

app.post('/getcars', (req, res) => {
    con.query("SELECT * FROM car_info", (err, result) => {
        if (err) throw err;
        // console.log(result);
        res.end(JSON.stringify(result))
    })
});

function markParkedAs(license_plate, value) {
    con.query(`UPDATE car_info SET parked = ${value} WHERE license_plate = '${license_plate}'`, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(license_plate, value, "change value success");
        }
    })
}

app.post('/toggleparked', (req, res) => { 
    console.log(req.body);
    console.log(req.body.license_plate, req.body.parked)
    con.query(`UPDATE car_info SET parked = ${req.body.parked} WHERE license_plate = '${req.body.license_plate}'`, (err, result) => {
        if (err) {
            throw err;
        } else {
            console.log(result);
        }
    })
    res.end(
        JSON.stringify({ success: true })
    );
});

app.post('/checkpermit', (req, res) => {
    // console.log(req.body);

    const filteredPlates = req.body['plates'].filter((plate, index, array) => {
        return array.indexOf(plate) === index;
    });

    console.log(`Car is ${req.body['entering'] ? 'entering' : 'exiting'}`);
    console.log('Possible plates are')
    console.log(filteredPlates) // log the data received

    con.query("SELECT * FROM car_info", (err, result) => {
        if (err) {
            res.status(500).send({
                message: 'Failed to access the database.'
            })
        }

        const car = result.find(car => filteredPlates.includes(car.license_plate));
        if (car === undefined) {
            console.log("this car is NOT authorized");
            if (req.body['entering']) {
                // markParkedAs(car.license_plate, 1);
                // car.parked = 1;
                let enteringCar = JSON.stringify({
                    car_color: 'UNREG',
                    car_make: 'UNREG',
                    car_model: 'UNREG',
                    license_plate: req.body['highest_confidence_plate'],
                    image_data: req.body.image_data,
                    parked: 1
                });
                sendToAllClients("message", enteringCar);
            } else {
                let enteringCar = JSON.stringify({
                    car_color: 'UNREG',
                    car_make: 'UNREG',
                    car_model: 'UNREG',
                    license_plate: req.body['highest_confidence_plate'],
                    image_data: req.body.image_data,
                    parked: 0
                });
                sendToAllClients("message", enteringCar);
            }
        } else {
            console.log("authorized car", req.body['entering'] == true, car)
            if (req.body['entering']) {
                markParkedAs(car.license_plate, 1);
                car.parked = 1;
                let enteringCar = JSON.stringify(car);
                sendToAllClients("message", enteringCar);
            } else {
                markParkedAs(car.license_plate, 0);
                car.parked = 0;
                let exitingCar = JSON.stringify(car);
                sendToAllClients("message", exitingCar);
            }
        }
    })

    // do some processing with the data (if needed)
    // send a response back
    res.status(200).send({
        message: 'Data received successfully.'
    });
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

// == CLI INTERFACE ==
var exec = require('child_process').exec;
function execute(command, callback){
    exec(command, function(error, stdout, stderr) {
        callback(stdout); 
    });
};

function getPermitInfo(licensePlate) {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM car_info WHERE license_plate = '${licensePlate}'`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

function updateEntry(licensePlate, entering) {
    return new Promise((resolve, reject) => {
        con.query(`UPDATE car_info SET parked = '${entering}' WHERE license_plate = '${licensePlate}'`, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// var watcher = chokidar.watch('./process_images', {ignored: /^\./, persistent: true});
// watcher.on('add', function(path) {
//     console.log('File', path, 'has been added');
    
// })

// plateSearchImage()