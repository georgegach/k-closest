import Heap from './heap.js'

export default class Seeker {
    /**
     * Seeks items closest neighbors in the array
     * @param {Array} list array of elements 
     * @param {Function} distanceFunction function comparing target element with the element of the array
     */
    constructor(list, distanceFunction) {
        this.list = Array.from(list)
        this.distanceFunction = distanceFunction || this.recomendedDiff()
    }

    /**
     * It's preferable to explicitely pass the distanceFunction but for us, lazy folks, here are some of the useful ones
     */
    recomendedDiff() {
        var object = this.list[0]


        if (typeof object === 'number')
            return function (a, b) { return Math.abs(a - b) }

        else if (object.length !== undefined) {
            if (typeof object[0] === 'number') {
                switch (object.length) {
                    case 2:
                        return function (a, b) {
                            return (
                                Math.pow(a[0] - b[0], 2) +
                                Math.pow(a[1] - b[1], 2)
                            )
                        }
                    case 3:
                        return function (a, b) {
                            return (
                                Math.pow(a[0] - b[0], 2) +
                                Math.pow(a[1] - b[1], 2) +
                                Math.pow(a[2] - b[2], 2)
                            )
                        }

                    default:
                        return function (a, b) {
                            return a.reduce((acc, val, i) => (Math.pow(val - b[i], 2) + acc), 0)
                        }
                }
            }
        }

        else {
            if ('r' in object && 'g' in object && 'b' in object) {
                return function (a, b) {
                    return (
                        Math.pow(a.r - b.r, 2) +
                        Math.pow(a.g - b.g, 2) +
                        Math.pow(a.b - b.b, 2)
                    )
                }
            }

            // TO-DO: Cover other types of Array of Objects etc
        }

        throw "Could not recommend distance function";
    }

    /**
     * Finds single closest element in O(n) 
     * @param {Object} item target element to search the closest for 
     */
    single(item) {
        var d = this.distanceFunction
        var candidate = this.list[0]
        var minDistance = d(item, candidate)

        for (let i = 1; i < this.list.length; i++) {
            let someDistance = d(item, this.list[i])
            if (someDistance < minDistance) {
                candidate = this.list[i]
                minDistance = someDistance
            }
        }

        return candidate
    }

    /**
     * Wrapper around the closest neighbor search methods implemented in this package for ease of use.
     * It's suggested to call whichever method suits you best explicitely though.
     * @param {Object} item target element to search the closest elements around 
     * @param {Number} closestK number of elements around target element to search for
     */
    get(item, closestK) {
        // TO-DO: implement a decision making logic with respect to N and K
        if (closestK === 1 || closestK === undefined)
            return this.single(item)
        else
            return this.wHeap(item, closestK)

    }

    /**
     * This is robust approach that builds MinHeap of size N and extracts K smallest elements (closest neighbors).
     * 
     * Optimal use case: When K is substantially large with respect to N.
     * 
     * @param {Object} item target element to search the closest elements around 
     * @param {Number} closestK number of elements around target element to search for
     */
    wHeapSort(item, closestK) {
        var d = this.distanceFunction

        var candidates = new Heap(function (a, b) {
            return (d(item, a) - d(item, b))
        })

        for (let i = 0; i < this.list.length; i++) {
            candidates.push(this.list[i])
        }

        return candidates.toArray(closestK)
    }

    /**
     * @param {Object} item target element to search the closest elements around 
     * @param {Number} closestK number of elements around target element to search for
     */
    _wBuildHeap(item, closest) {
        var d = this.distanceFunction

        var candidates = new Heap(function (a, b) {
            return (d(item, a) - d(item, b))
        }).buildHeap(Array.from(this.list))

        return candidates.toArray(closestK)
    }

    /**
     * Naive sort-based but 2-liner approach for finding closest k neighbors of the item.
     * 
     * Optimal use case: Never. 
     * 
     * @param {Object} item target element to search the closest elements around 
     * @param {Number} closestK number of elements around target element to search for
     */
    wSort(item, closestK) {
        var cmp = (a, b) => (this.distanceFunction(item, a) - this.distanceFunction(item, b))
        return Array.from(this.list).sort(cmp).slice(0, closestK)
    }

    /**
     * Natural closest neighbor selection. Find MinDistances K times. 
     * This is a modification of BubbleSort where outer loop is only called K times, that guarantees to find K min elements.
     * 
     * Optimal use case: Maybe when N and K are <10. Generally, never.
     * 
     * @param {Object} item target element to search the closest elements around 
     * @param {Number} closestK number of elements around target element to search for
     */
    wBubble(item, closestK) {
        var cmp = (a, b) => (this.distanceFunction(item, a) - this.distanceFunction(item, b))
        var a = Array.from(this.list)
        var i, j, iMin, tmp, n = this.list.length;
        for (j = 0; j < closestK; j++) {
            iMin = j
            for (i = j + 1; i < n; i++) {
                if (cmp(a[i], a[iMin]) < 0) {
                    iMin = i
                }
            }
            if (iMin != j) {
                tmp = a[iMin]
                a[iMin] = a[j]
                a[j] = tmp

                // console.log(a)
            }
        }
        return a.slice(0, closestK)
    }

    /**
     * Memory friendly approach that builds MaxHeap of size K as a candidate list. 
     * 
     * Optimal use case: Almost always, unless K is too large with respect to N. 
     * 
     * @param {Object} item target element to search the closest elements around
     * @param {Number} closestK number of elements around target element to search for
     */
    wHeap(item, closestK) {
        var d = this.distanceFunction

        var candidates = new Heap(function (a, b) {
            return (d(item, b) - d(item, a))
        })

        for (let i = 0; i < closestK; i++) {
            candidates.push(this.list[i])
        }

        var maxDistance = d(item, candidates.peek())
        var someDistance = 0

        for (let i = closestK; i < this.list.length; i++) {
            someDistance = d(item, this.list[i])

            if (someDistance < maxDistance) {
                candidates.push(this.list[i])
                candidates.pop()
                maxDistance = d(item, candidates.peek())
            }
        }

        return candidates.toArray().reverse();
    }
}