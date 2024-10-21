const fs = require('node:fs');

make_message();
function make_message(){
    let results = '';
    let quickMessage = '';

    // Results
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/results-endresult.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Best songs per score ###\n';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["title"] + ' of '+results[i]["album"] + ' ('+results[i]['Current score']+')\n';
    }

    // Outliers
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/biggest_differences_score.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Smallest differences ###\n';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["title"] + ' of '+results[i]["album"] + ' (Rating [actual]: '+parseFloat(results[i]['rating'])+'; Rating [percentile]:'+parseFloat(results[i]['vote_percentile']).toFixed(3)+'%; ELO:'+parseFloat(results[i]['rankscore']).toFixed(3)+'%; Difference of '+parseFloat(results[i]['scoreDiff']).toFixed(3)+')\n';
    }

    quickMessage += '### Biggest differences ###\n';
    for(let i=1;i<6;i++){
        quickMessage += results[results.length-i]["title"] + ' of '+results[results.length-i]["album"] + ' (Rating [actual]: '+parseFloat(results[results.length-i]['rating'])+'; Rating [percentile]:'+parseFloat(results[results.length-i]['vote_percentile']).toFixed(3)+'%; ELO:'+parseFloat(results[results.length-i]['rankscore']).toFixed(3)+'%; Difference of '+parseFloat(results[results.length-i]['scoreDiff']).toFixed(3)+')\n';
    }

    // Best Albums
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/averages_album.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Best Albums ###\n';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["elementName"] + ' ('+parseFloat(results[i]['score']).toFixed(3)+') ['+results[i]['nbOfSongs']+' songs]\n';
    }

    // Best Artists
    try{
        results = fs.readFileSync(__dirname+'/../data/_results/averages_artist.json');
        results = JSON.parse(results);
    }catch(err){
        console.error(err);
    }

    quickMessage += '### Best Artists ###\n';
    for(let i=0;i<5;i++){
        quickMessage += results[i]["elementName"] + ' ('+parseFloat(results[i]['score']).toFixed(3)+') ['+results[i]['nbOfSongs']+' songs]\n';
    }

    fs.writeFileSync(__dirname+'/../data/_results/_quickrank-message.md',quickMessage);
}