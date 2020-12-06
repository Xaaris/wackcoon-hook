var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.htm');
	console.log('get /');
});

app.get('/payload', function (req, res) {
    res.sendStatus(200);
	console.log('get /payload');
});

app.post('/payload', function (req, res) {
	console.log('Received new event: ' + req.body.event);

	console.log('pulling code from GitHub...');

	// reset any changes that have been made locally
	exec('git -C ~/Desktop/Gastos/code/gastos-backend reset --hard', execCallback);

	// and ditch any files that have been added locally too
	exec('git -C ~/Desktop/Gastos/code/gastos-backend clean -df', execCallback);

	// now pull down the latest
	exec('git -C ~/Desktop/Gastos/code/gastos-backend pull -f', execCallback);

	exec('echo Building bootable jar', execCallback);
	exec('~/Desktop/Gastos/code/gastos-backend/gradlew -b ~/Desktop/Gastos/code/gastos-backend/build.gradle.kts bootJar', execCallback);

	exec('echo Moving jar', execCallback);
	exec('mv ~/Desktop/Gastos/code/gastos-backend/build/libs/gastos-backend.jar ~/Desktop/Gastos/gastos-backend.jar', execCallback);

	exec('echo Making jar executable', execCallback);
	exec('chmod +x ~/Desktop/Gastos/gastos-backend.jar', execCallback);

	exec('echo Stopping and starting service', execCallback);
	exec('sudo systemctl stop gastos-backend.service', execCallback);

	exec('sudo systemctl start gastos-backend.service', execCallback);

	exec('echo All done', execCallback);
});

app.listen(5000, function () {
	console.log('listening on port 5000')
});

function execCallback(err, stdout, stderr) {
	if(stdout) console.log(stdout);
	if(stderr) console.log(stderr);
}