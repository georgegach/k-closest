var Benchmark = require("benchmark");
var fs = require('fs');
const si = require('systeminformation');
var package = require('../package.json');
const Seeker = require('../lib/index.umd.js').Seeker;

// var config = {
//     k: [5, 10, 50, 100, 500, 1000, 5000, 10000, 50000],
//     n: [10, 100, 1000, 10000, 100000],
// }

var config = {
    k: [5, 10, 50, 100, 500, 1000, 5000, 10000, 50000],
    n: [100000],
}

var start = new Date()
var logs = []
var csvs = []


runBenchmarks(config)


// -------------------------------------------------------------------------------

function log(line) {
    console.log(line)
    logs.push(line)
}


function csv(line) {
    String.prototype.replaceAll = function (search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    csvs.push(line.slice(1, -1).replaceAll(" ", "").split('|').join(','))
}


async function runBenchmarks(config) {
    log("# Performance benchmarks")
    log("Following benchmarks were executed on `" + new Date().toDateString() + "` with `k-closest@" + package.version + "`\n```\n> System information\n")
    var data = await si.cpu()
    log(data.manufacturer + " " + data.brand + " " + data.speed + " GHz (" + data.cores + " cores)")
    data = await si.osInfo()
    log(data.distro + " (" + data.arch + ") " + data.release + "\n```\n## Overview\n![Chart](chart.png)\n")

    var cmp = (a, b) => a - b
    var locked = false

    for (let i = 0; i < config.n.length; i++) {
        n = config.n[i]

        log("## N=" + n)
        log("```\n> Generate random dataset of size [" + n + "]")
        var arr = []
        for (let i = 0; i < n; i++) {
            arr.push(Math.floor(Math.random() * n * 10))
        }
        var targetValue = Math.floor(n / 2)

        var closest = new Seeker(Array.from(arr), function (a, b) {
            return (Math.abs(targetValue - b) - Math.abs(targetValue - a))
        })


        log("> Check results of the algorithms")

        var resultA = closest.wSort(targetValue, 10).sort(cmp)
        var resultB = closest.wBubble(targetValue, 10).sort(cmp)
        var resultC = closest.wHeapSort(targetValue, 10).sort(cmp)
        var resultD = closest.wHeap(targetValue, 10).sort(cmp)

        if (JSON.stringify(resultA) !== JSON.stringify(resultB) || JSON.stringify(resultA) !== JSON.stringify(resultC) || JSON.stringify(resultA) !== JSON.stringify(resultD)) {
            log('> Results Do Not Match!')
            log('>> Sort    \t' + JSON.stringify(resultA))
            log('>> Bubble  \t' + JSON.stringify(resultB))
            log('>> HeapSort\t' + JSON.stringify(resultC))
            log('>> Heap    \t' + JSON.stringify(resultD))
        }
        log("> Run benchmarks\n```\n\n")
        log("| Method | **N** Elements | **K** Closest | **S**peed (runs/sec) | Relative Perfomance | Effectiveness (N×K×S×λ) | ")
        log("|--------|----------------|---------------|----------------------|---------------------|-------------------------|")

        for (let j = 0; j < config.k.length; j++) {
            k = config.k[j]

            if (k < n) {
                var suite = new Benchmark.Suite();

                suite
                    .add("| Sort | " + n + " | " + k + " | ", function () {
                        closest.wSort(targetValue, k).sort(cmp)
                    })
                    .add("| Bubble | " + n + " | " + k + " | ", function () {
                        closest.wBubble(targetValue, k).sort(cmp)
                    })
                    .add("| HeapSort | " + n + " | " + k + " | ", function () {
                        closest.wHeapSort(targetValue, k).sort(cmp)
                    })
                    .add("| Heap | " + n + " | " + k + " | ", function () {
                        closest.wHeap(targetValue, k).sort(cmp)
                    })
                    .on("cycle", function (e) {
                        var data = e.target.name
                        var relative = Math.round((e.target.hz / e.currentTarget[0].hz) * 100) / 100
                        var effectiveness = Math.round(e.target.hz * n * k / 1e+5) / 1e+2
                        data += Math.round(e.target.hz * 100) / 100 + " | " + relative + "x | " + effectiveness + " |"
                        log(data)
                        csv(data)
                    })
                    .on("complete", function (e) {
                    })
                    .run({ 'async': false });
            }

        }
        log("\n\n")

    }

    log("\nTotal benchmark time: `" + Math.round((new Date() - start) / 1000 / 60) + " minutes`\n")
    writeFile("./scripts/logs/benchmark.csv", csvs.join('\n'))
    writeFile("./scripts/logs/benchmark.md", logs.join('\n'))
}


function writeFile(filename, content) {
    fs.writeFile(filename, content, function (err) {
        if (err)
            return console.log(err);
        else
            console.log("The [" + filename + "] was saved!");
    });
}
