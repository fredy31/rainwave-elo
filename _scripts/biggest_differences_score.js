const fs = require('node:fs');

biggest_differences_score();
function biggest_differences_score(){
    let results = '';
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/results-endresult.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    let newArray = [];
    var i=results.length;

    results.sort((a,b)=>b.rating-a.rating);
    results.forEach(el=>{
        if(el.rating){
            let votescore = i/results.length*100;
            let voteArray = {
                vote_percentile:votescore
            };
            newArray.push({...el, ...voteArray});
        }
        i--;
    })
    console.log(newArray);

    newArray.sort((a,b)=>b['Current score']-a['Current score']);
    let differencesArray = [];
    var i=results.length;

    newArray.forEach(el=>{
        //console.log(el)
        let votescore = el.vote_percentile;
        let rankscore = i/results.length*100;
        let scoreDiff = {
            votescore: votescore,
            rankscore: rankscore,
            scoreDiff: Math.abs(votescore-rankscore)
        };
        differencesArray.push({...el, ...scoreDiff});
        i--;
    })
    
    differencesArray.sort((a,b)=>b.scoreDiff-a.scoreDiff);
    try{
        let write = JSON.stringify(differencesArray);
        fs.writeFileSync(__dirname+'/../data/_results/biggest_differences_score.json',write);
    }catch(err){
        console.error(err);
    }

    var json = differencesArray
    var fields = Object.keys(json[0])
    var replacer = function(key, value) { return value === null ? '' : value } 
    var csv = json.map(function(row){
    return fields.map(function(fieldName){
        return JSON.stringify(row[fieldName], replacer)
    }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    fs.writeFileSync(__dirname+'/../data/_results/biggest_differences_score.csv',csv);
}