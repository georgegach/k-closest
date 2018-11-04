const expect = require('chai').expect;
const Seeker = require('../lib/index.umd.js').Seeker;
const Heap = require('../lib/index.umd.js').Heap;

describe('Heap', () => {

    it('Make heap of 0..9 and return correct array', () => {
        var h = new Heap()
        for (let i = 0; i < 10; i++) {
            h.push(i)
        }
        expect(h.heap).to.deep.equal([9, 8, 5, 6, 7, 1, 4, 0, 3, 2]);
    });

    it('Make heap of 0..9 and execute pops', () => {
        var h = new Heap().buildHeap([0,1,2,3,4,5,6,7,8,9])
        for (let i = 0; i < 10; i++) {
            expect(h.pop()).to.be.equal(9 - i);
        }
    });


    it('Sort random array in ascending order', () => {
        var h = new Heap((a,b) => a - b)
        var arr = []
        for (let i = 0; i < 10; i++) {
            let r = Math.floor(Math.random() * 100)
            arr.push(r)
            h.push(r)
        }
        expect(h.toArray()).to.deep.equal(arr.sort((a, b) => a - b));
    });

    it('Sort random array in descending order', () => {
        var h = new Heap()
        var arr = []
        for (let i = 0; i < 10; i++) {
            let r = Math.floor(Math.random() * 100)
            arr.push(r)
            h.push(r)
        }
        expect(h.toArray()).to.deep.equal(arr.sort((a, b) => b - a));
    });

});


describe('Closest', () => {

    it('Create 0..99 array and get 17 closest for 49', () => {
        var arr = []
        for (let i = 0; i < 99; i++) {
            arr.push(i)
        }
        var closest = new Seeker(arr)
        expect(closest.get(49, 17).sort()).to.deep.equal([57, 41, 42, 56, 55, 43, 54, 44, 45, 53, 46, 52, 51, 47, 48, 50, 49].sort());
    });

    it('Create 0..99 array and get single closest for 49', () => {
        var arr = []
        for (let i = 0; i < 99; i++) {
            arr.push(i)
        }
        var closest = new Seeker(arr)
        expect(closest.get(49)).to.be.equal(49);
    });


    it('Closest 4 colors to Black = ["Black", "Green", "Maroon", "Navy"]', () => {
        var closest = new Seeker(HTML_COLORS)
        var result = closest.get({
            r: 0, g: 0, b:0
        }, 4).map(e => e.name).sort()
        expect(result).to.deep.equal(["Black", "Green", "Maroon", "Navy"]);
    });

    it('Closest 2 colors to White = ["Silver", "White" ]', () => {
        var closest = new Seeker(HTML_COLORS)
        var result = closest.get({
            r: 255, g: 255, b:255
        }, 2).map(e => e.name).sort()
        expect(result).to.deep.equal(['Silver', 'White' ] );
    });


});


var HTML_COLORS = [
    {
        "name": "White",
        "hex": "#FFFFFF",
        "r": 255,
        "g": 255,
        "b": 255
    },
    {
        "name": "Silver",
        "hex": "#C0C0C0",
        "r": 192,
        "g": 192,
        "b": 192
    },
    {
        "name": "Gray",
        "hex": "#808080",
        "r": 128,
        "g": 128,
        "b": 128
    },
    {
        "name": "Black",
        "hex": "#000000",
        "r": 0,
        "g": 0,
        "b": 0
    },
    {
        "name": "Red",
        "hex": "#FF0000",
        "r": 255,
        "g": 0,
        "b": 0
    },
    {
        "name": "Maroon",
        "hex": "#800000",
        "r": 128,
        "g": 0,
        "b": 0
    },
    {
        "name": "Yellow",
        "hex": "#FFFF00",
        "r": 255,
        "g": 255,
        "b": 0
    },
    {
        "name": "Olive",
        "hex": "#808000",
        "r": 128,
        "g": 128,
        "b": 0
    },
    {
        "name": "Lime",
        "hex": "#00FF00",
        "r": 0,
        "g": 255,
        "b": 0
    },
    {
        "name": "Green",
        "hex": "#008000",
        "r": 0,
        "g": 128,
        "b": 0
    },
    {
        "name": "Aqua",
        "hex": "#00FFFF",
        "r": 0,
        "g": 255,
        "b": 255
    },
    {
        "name": "Teal",
        "hex": "#008080",
        "r": 0,
        "g": 128,
        "b": 128
    },
    {
        "name": "Blue",
        "hex": "#0000FF",
        "r": 0,
        "g": 0,
        "b": 255
    },
    {
        "name": "Navy",
        "hex": "#000080",
        "r": 0,
        "g": 0,
        "b": 128
    },
    {
        "name": "Fuchsia",
        "hex": "#FF00FF",
        "r": 255,
        "g": 0,
        "b": 255
    },
    {
        "name": "Purple",
        "hex": "#800080",
        "r": 128,
        "g": 0,
        "b": 128
    }
]