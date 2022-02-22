let today = new Date()
let date = today.getDate()
console.log(date)


let today1 = new Date()
let month = today1.getMonth()
console.log(month)

function getBatchInfo(Info){
    console.log(Info)
}

module.exports.date = date
module.exports.month = month
module.exports.information=getBatchInfo