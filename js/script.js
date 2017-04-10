/*global $, console, Paho*/

var ledMatrix = new Array(8).fill(new Array(8).fill(false));
var client = new Paho.MQTT.Client('broker.mqttdashboard.com', 8000, 'ibraesch');

//Gets  called if the websocket/mqtt connection gets disconnected for any reason
client.onConnectionLost = function (responseObject) {
    console.log('Connection lost: ' + responseObject.errorMessage);
};

//Gets called whenever you receive a message for your subscriptions
client.onMessageArrived = function (message) {
    console.log('Message arrived: ' + message.destinationName + ' : ' + message.payloadString);
};

//Connect Options
var options = {
    timeout: 3,
    //Gets Called if the connection has sucessfully been established
    onSuccess: function () {
        console.log('Connected');
    },
    //Gets Called if the connection could not be established
    onFailure: function (message) {
        console('Connection failed: ' + message.errorMessage);
    }
};

//Creates a new Paho.MQTT.Message Object and sends it to the HiveMQ MQTT Broker
var publish = function (payload, topic, qos) {
    //Send your message (also possible to serialize it as JSON or protobuf or just use a string, no limitations)
    var message = new Paho.MQTT.Message(payload);
    message.destinationName = topic;
    message.qos = qos;
    client.send(message);
};


function setLed(event) {
    ledMatrix[event.data.row][event.data.col] = !ledMatrix[event.data.row][event.data.col];
    $('#led-matrix .cell.row' + event.data.row + '.col' + event.data.col).toggleClass('selected');
    publish(ledMatrix[event.data.row][event.data.col].toString(), 'ibraesch/ledMatrix/led/' + event.data.row + '/' + event.data.col, 1);
    console.log('setLed ' + event.data.row + ':' + event.data.col + ' ' + ledMatrix[event.data.row][event.data.col]);
}

function setCol(event) {
    var i = 0;
    for (i = 0; i < 8; i++) {
        ledMatrix[i][event.data.col] = event.data.state;
    }
    $('#led-matrix .col' + event.data.col).toggleClass('selected', event.data.state);
    publish(event.data.state.toString(), 'ibraesch/ledMatrix/col/' + event.data.col, 1);
    console.log('setCol ' + event.data.col + ' ' + event.data.state);
}

function setAll(event) {
    ledMatrix.fill(new Array(8).fill(event.data.state));
    $('#led-matrix .led').toggleClass('selected', event.data.state);
    publish(event.data.state.toString(), 'ibraesch/ledMatrix/all/', 1);
    console.log('setAll ' + event.data.state);
}

function setRow(event) {
    ledMatrix[event.data.row].fill(event.data.state);
    $('#led-matrix .row' + event.data.row).toggleClass('selected', event.data.state);
    publish(event.data.state.toString(), 'ibraesch/ledMatrix/row/' + event.data.row, 1);
    console.log('setRow ' + event.data.row + ' ' + event.data.state);
}

function generateMatrix() {
    var i = 0,
        j = 0;
    $('#led-matrix').append($('<div>').addClass('row'));
    for (j = 0; j < 8; j++) {
        $('#led-matrix div.row:last').append($('<span>').addClass('cell row-header').append($('<span>').addClass('flex-button-container').append($('<button>').addClass('reset-col').text('0').click({
            col: j,
            state: false
        }, setCol)).append($('<button>').addClass('set-col').text('1').click({
            col: j,
            state: true
        }, setCol))));
    }
    $('#led-matrix div.row:last').append($('<span>').addClass('cell row-header col-header').append($('<span>').addClass('flex-button-container').append($('<button>').addClass('reset-all').text('0').click({
        state: false
    }, setAll)).append($('<button>').addClass('set-all').text('1').click({
        state: true
    }, setAll))));
    for (i = 0; i < 8; i++) {
        $('#led-matrix').append($('<div>').addClass('row'));
        for (j = 0; j < 8; j++) {
            $('#led-matrix div.row:last').append($('<span>').addClass('cell row' + i + ' col' + j + ' led').click({
                row: i,
                col: j
            }, setLed));
        }
        $('#led-matrix div.row:last').append($('<span>').addClass('cell col-header').append($('<span>').addClass('flex-button-container').append($('<button>').addClass('reset-row').text('0').click({
            row: i,
            state: false
        }, setRow)).append($('<button>').addClass('set-row').text('1').click({
            row: i,
            state: true
        }, setRow))));
    }
}