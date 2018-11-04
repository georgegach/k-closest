const ChartjsNode = require('chartjs-node');
const fs = require('fs')
var data = fs.readFileSync('./scripts/logs/benchmark.csv').toString().split('\n').map(e => e.split(',')).filter(e => e[1] == 100000)
var colors = {
    'Sort': '#0277BD',
    'Bubble': '#F4511E',
    'HeapSort': '#00E676',
    'Heap': '#C6FF00'
}


var labels = data.filter(e => e[0] == 'Sort').map(e => parseInt(e[2]))
var data = data.reduce(
    function (map, obj) {
        f = data.filter(e => e[0] == obj[0]);
        map.push({
            label: obj[0],
            backgroundColor: colors[obj[0]],
            borderColor: colors[obj[0]],
            data: f.map(e => parseFloat(e[4].slice(0, -1))),
            fill: false
        }); return map
    }, []).slice(0, 4);

console.log(data)

var config = {
    type: 'line',
    data: {
        labels: labels,
        datasets: data
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Performance Benchmarks for 100k elements'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                // type: 'linear',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'K number of neighbors'
                }
            }],
            yAxes: [{
                type: 'logarithmic',
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Relative Performance (log)'
                },
                labels: [0, 1, 10, 20, 50, 100],
                ticks: {
                    callback: function (label, index, labels) {
                        console.log(labels)
                        switch (label) {
                            case 0.5:
                            case 1:
                            case 2:
                            case 4:
                            case 10:
                            case 20:
                            case 50:
                            case 100:
                                return label + 'x';
                            default:
                                return ""
                        }
                    },
                    max: 100,
                    min: 0.5
                },

            }]
        }
    }
};


// 600x600 canvas size
var chartNode = new ChartjsNode(1000, 400);
return chartNode.drawChart(config)
    .then(() => {
        // chart is created

        // get image as png buffer
        return chartNode.getImageBuffer('image/png');
    })
    .then(buffer => {
        Array.isArray(buffer) // => true
        // as a stream
        return chartNode.getImageStream('image/png');
    })
    .then(streamResult => {
        // using the length property you can do things like
        // directly upload the image to s3 by using the
        // stream and length properties
        streamResult.stream // => Stream object
        streamResult.length // => Integer length of stream
        // write to a file
        return chartNode.writeImageToFile('image/png', './scripts/logs/chart.png');
    })
    .then(() => {
        // chart is now written to the file path
        // ./testimage.png
    });