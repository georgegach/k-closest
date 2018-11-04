export default class Heap {
    /**
     * 
     * @param {Function} comparator function for comparing elements. 
     */
    constructor(comparator) {
        this.heap = [null]
        this.size = 0;
        this.c = comparator || function (a, b) { return b-a }
    }

    static parent(i) { return (i - 1) >> 1; }
    static left(i) { return (i << 1) + 1; }
    static right(i) { return (i << 1) + 2; }

    /**
     * Builds heap
     * @param {object} array array to build the heap from
     */
    buildHeap(array) {
        this.heap = array
        this.size = array.length
        var n = Math.floor(this.size/2) - 1
        for (let i = n; i >= 0; i--) {
            this.heapify(i)
        }

        return this
    }


    /**
     * Insert object in O(logN)
     * @param {object} item object that is being pushed
     */
    push(item) {
        var idx = this.size++;
        var h = this.heap

        h[idx] = item
        var p = (idx - 1) >> 1;

        while (idx > 0 && this.c(h[idx], h[p]) < 0) {
            var tmp = h[p]
            h[p] = h[idx]
            h[idx] = tmp
            idx = p
            p = (p - 1) >> 1;
        }
    }

    /**
     * Peek at the root node in O(1). 
     */
    peek() { return this.heap[0] }
    
    /**
     * Extract the root object from the tree in O(logN)
     */
    pop() {
        if (this.size === 0)
            return null;

        var root = this.heap[0]
        this.heap[0] = this.heap[--this.size]
        this.heap[this.size] = null;

        this.heapify(0)

        return root;
    }


    /**
     * Extract k elements from the heap and return as an array in O(k*logk)
     * @param {number} k number of elements to be extracted
     */
    toArray(k) {
        var limit = k || this.size
        var arr = []
        for (let i = 0; i < limit; i++){ 
            arr.push(this.pop())
        }
        return arr
    }

    /**
     * Standard heapify method
     * @param {number} idx index to start heapify
     */
    heapify(idx) {
        var h = this.heap
        var n = this.size

        while (true) {
            var l = (idx << 1) + 1;
            var r = l + 1;
            var p = idx;

            if (l < n && this.c(h[l], h[p]) < 0) {
                p = l;
            }

            if (r < n && this.c(h[r], h[p]) < 0) {
                p = r
            }

            if (p !== idx) {
                var tmp = h[idx]
                h[idx] = h[p]
                h[p] = tmp
                idx = p
            } else {
                break;
            }
        }
    }
}