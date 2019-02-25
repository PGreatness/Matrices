const fs = require('fs')
var file = require('./line')
class Matrix {
    constructor(size_x, size_y) {
        if (!(Number.isInteger(size_x) || Number.isInteger(size_y))) {
            throw new Error("sizes must be integers")
        }
        if (size_x <= 3 || size_y <= 3) {
            throw new Error("sizes should not be less than or equal to 3")
        }
        if (size_x == undefined) {
            this.rows = 4
        }else{
            this.rows = size_x
        }
        if (size_y == undefined) {
            this.cols = 4
        }else{
            this.cols = size_y
        }
        this.arr = []
        for (var i = 0; i < this.rows; i++) {
            var push = new Array(this.cols)
            for (var w = 0; w < this.cols; w++) {
                push[w] = NaN
            }
            this.arr.push(push)
        }
    }

    toString() {
        var arr = this.arr
        var str = ""
        for (var i =0; i < arr.length; i++) {
            var line = "| "
            for (var w = 0; w < arr[0].length; w++) {
                line += `${arr[i][w]} `
            }
            line += "|\n"
            str += line
        }
        return str
    }

    addPoint(point_x, point_y, point_z) {
        var arr = this.arr
        for (var i = 0; i < arr[0].length; i++) {
            // console.log(i)
            if (isNaN(arr[0][i])) {
                arr[0][i] = point_x
                arr[1][i] = point_y
                arr[2][i] = point_z
                arr[3][i] = 1
                this.arr = arr
                return true
            }
        }
        throw new Error("Not enough space in matrix")
    }

    addEdge(x1, y1, z1, x2, y2, z2) {
        try {
            this.addPoint(x1, y1, z1)
            this.addPoint(x2, y2, z2)
            console.log(`Edge (${x1}, ${y1}, ${z1}) to (${x2}, ${y2}, ${z2}) added to Matrix`)
            return true
        } catch (error) {
            console.log("Not enough space in Matrix")
            return false
        }
        
    }
    multiplyMatrix(second) {
        if (!(second instanceof Matrix)) {
            throw new Error("second object not a matrix")
        }
        if (this.cols != second.rows) {
            throw new Error("second Matrix is not compatible")
        }
        var retMatrix = new Matrix(this.rows, second.cols)
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < second.cols; j++) {
                var sum = 0
                for (var w = 0; w < this.cols; w++) {
                    // console.log(`i:${i}\tw:${w}\tj:${j}`)
                    sum += this.arr[i][w] * second.arr[w][j]
                }
                retMatrix.setFirstNaN(sum)
            }
        }
        second = retMatrix
        return retMatrix
    }

    setFirstNaN(number) {
        for (var a = 0; a < this.rows; a++) {
            for (var b = 0; b < this.cols; b++) {
                if (isNaN(this.arr[a][b])) {
                    this.arr[a][b] = number
                    return true
                }
            }
        }
        return false
    }

    indentityMatrix() {
        var retMat = new Matrix(this.rows, this.cols)
        for (var i = 0; i < this.rows; i++) {
            for (var w = 0; w < this.cols; w++) {
                if (i == w) {
                    retMat.arr[i][w] = 1
                }else{
                    retMat.arr[i][w] = 0
                }
            }
        }
        return retMat
    }

}

var edges = new Matrix(4, 4)
console.log(`adding points to edge matrix\n`)
edges.addEdge(11, 12, 1, 55, 51, 1)
edges.addEdge(43, 32, 1, 20, 35, 1)
console.log("adding done\n")

var others = new Matrix(4, 4)
for (var i = 0; i < 2; i++) {
    console.log(`adding (${i}, ${i + 1}, ${i + 2}) and (${i + 3}, ${i + 10}, ${i + 0}) to Matrix\n`)
    others.addEdge(i, i + 1, i + 2, i + 3, i + 10, i * 0)
}
console.log("adding edges done\n")

console.log(`The identity matrix of \n${others.toString()} is this matrix:\n${others.indentityMatrix().toString()}\n`)
edges = edges.multiplyMatrix(others)
console.log(edges.toString())
for (let i = 0; i < edges.rows - 1; i++) {
    file.makeLine(edges.arr[0][i], edges.arr[1][i], edges.arr[0][i + 1], edges.arr[1][i + 1])
}
file.makeLine(edges.arr[0][2], edges.arr[1][2], edges.arr[0][3], edges.arr[1][3])
console.log(edges.toString())

file.imgWrite()

others = others.multiplyMatrix(others)
console.log(others.toString())
for (let i = 0; i < others.rows - 1; i++) {
    file.makeLine(others.arr[0][i], others.arr[1][i], others.arr[0][i + 1], others.arr[1][i + 1])
}
file.makeLine(others.arr[0][2], others.arr[1][2], others.arr[0][3], others.arr[1][3])
console.log(others.toString())

file.imgWrite()


var image = new Matrix(4, 50)
for (i =0; i < 50; i++) {
    image.addPoint(Math.ceil(Math.random() * i) * 20, Math.ceil(Math.random() * i) * 20, 1)
}

for (i =0; i < 49; i++) {
    file.makeLine(image.arr[0][i], image.arr[1][i], image.arr[0][i + 1], image.arr[1][i + 1])
}

file.imgWrite()