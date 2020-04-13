const xlsx = require('node-xlsx');
exports.exportExcel = function(name,_headers,rows,keys){

    let data = [];
    data.push(_headers);

    rows.forEach(function(item){
        let row = [];
        for(let value of keys) {
            row.push(item[value])
        }
        data.push(row)
    });

    let result = xlsx.build([{name: name, data: data}]); // Returns a buffer
    return result;
}