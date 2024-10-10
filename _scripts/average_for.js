const fs = require('node:fs');

for(var i=0;i<process.argv.length;i++){
    switch(process.argv[i]){
        case 'album':
            average_for('album');
            break;
        case 'artist':
            average_for('artist');
            break;
    }
}
module.exports.album = average_for
module.exports.artist = average_for

function average_for(of){
    let results = '';
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/results-endresult.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    let resultArray = [];
    results.forEach(el=>{
        if(resultArray[el[of]]){
            resultArray[el[of]].push(el['Current score'])
        }else{
            resultArray[el[of]] = [el['Current score']]
        }
    })
    
    let averagesArray = [];
    Object.keys(resultArray).forEach(key => {
        let total = 0;
        resultArray[key].forEach(x=>{
            total+=x;
        })
        if(resultArray[key].length>1){
            averagesArray.push({
                elementName:key.toString(),
                score:(total/resultArray[key].length).toString(),
                nbOfSongs:resultArray[key].length
            });
        }
    })

    averagesArray.sort((a,b)=>b.score-a.score);
    try{
        let write = JSON.stringify(averagesArray);
        fs.writeFileSync(__dirname+'/../data/_results/averages_'+of+'.json',write);
    }catch(err){
        console.error(err);
    }

    //console.log(averagesArray);

    var json = averagesArray
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value } 
    var csv = json.map(function(row){
    return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
    }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    fs.writeFileSync(__dirname+'/../data/_results/averages_'+of+'.csv',csv);
}