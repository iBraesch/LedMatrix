/*global $, console*/

var ledMatrix = new Array(8).fill(new Array(8).fill(false));

function setLed(event) {
    ledMatrix[event.data.row][event.data.col] = !ledMatrix[event.data.row][event.data.col];
    $('#led-matrix .cell.row' + event.data.row + '.col' + event.data.col).toggleClass('selected');
    console.log('setLed ' + event.data.row + ':' + event.data.col + ' ' + ledMatrix[event.data.row][event.data.col]);
}

function setCol(event) {
    var i = 0;
    for (i = 0; i < 8; i++) {
        ledMatrix[i][event.data.col] = event.data.state;
    }
    $('#led-matrix .col' + event.data.col).toggleClass('selected', event.data.state);
    console.log('setCol ' + event.data.col + ' ' + event.data.state);
}

function setAll(event) {
    ledMatrix.fill(new Array(8).fill(event.data.state));
    $('#led-matrix .led').toggleClass('selected', event.data.state);
    console.log('setAll ' + event.data.state);
}

function setRow(event) {
    ledMatrix[event.data.row].fill(event.data.state);
    $('#led-matrix .row' + event.data.row).toggleClass('selected', event.data.state);
    console.log('setRow ' + event.data.row + ' ' + event.data.state);
}

function generateMatrix() {
    var i = 0,
        j = 0;
    $('#led-matrix').append($('<div>').addClass('row'));
    for (j = 0; j < 8; j++) {
        $('#led-matrix div.row:last').append($('<span>').addClass('cell row-header').append($('<span>').addClass('flex-button-container').append($('<button>').addClass('reset-col').text('0').click({col: j, state: false}, setCol)).append($('<button>').addClass('set-col').text('1').click({col: j, state: true}, setCol))));
    }
    $('#led-matrix div.row:last').append($('<span>').addClass('cell row-header col-header').append($('<span>').addClass('flex-button-container').append($('<button>').addClass('reset-all').text('0').click({state: false}, setAll)).append($('<button>').addClass('set-all').text('1').click({state: true}, setAll))));
    for (i = 0; i < 8; i++) {
        $('#led-matrix').append($('<div>').addClass('row'));
        for (j = 0; j < 8; j++) {
            $('#led-matrix div.row:last').append($('<span>').addClass('cell row' + i + ' col' + j + ' led').click({row: i, col: j}, setLed));
        }
        $('#led-matrix div.row:last').append($('<span>').addClass('cell col-header').append($('<span>').addClass('flex-button-container').append($('<button>').addClass('reset-row').text('0').click({row: i, state: false}, setRow)).append($('<button>').addClass('set-row').text('1').click({row: i, state: true}, setRow))));
    }
}