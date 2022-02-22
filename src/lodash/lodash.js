const lodash =require("lodash")
const month = ["jan","feb","mar","apr","may","june","july","aug","sep","oct","nov","dec"];
const odds =[1,3,5,7,9,11,13,15,17,19]

const arr1 = [1,2,3,4]
const arr2 =[3,6,1,7]
const arr3 =[4,6,1,2]
const arr4 =[6,9,1,4]
const arr5 = [0,5,2,5]

const dict =[['horror','the shining'],['drama','titanic'],['thriller','shutter island'],['fantasy','pans labyrinth']]

function arrSpliter(){
    console.log(lodash.chunk(month,3))
}

function giveTail(){
    console.log(lodash.tai1(odds))
}

function arrUnion(){
    console.log(lodash.union(arr1,arr2,arr3,arr4,arr5))
}

function getPairs(){
    console.log(lodash.fromPairs(dict))
}

module.exports.arrSpliter = arrSpliter
module.exports.giveTail = giveTail
module.exports.arrUnion = arrUnion
module.exports.getPairs= getPairs