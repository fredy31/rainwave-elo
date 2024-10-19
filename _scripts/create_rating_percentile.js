const fs = require('node:fs');

create_rating_percentile();
function create_rating_percentile(){
    let songsArray = [];
    let directory = __dirname+'/../data/songs/';
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        let i=1;
        for (const file of files) {
            i++;
            if(file != '.gitignore'){
                let filecontents = fs.readFileSync(directory+file);
                filecontents = JSON.parse(filecontents);
                songsArray.push(filecontents);
                //console.log(songsArray);
                console.log('Working: '+i+'/'+files.length);
            }
        }
        songsArray.sort((a,b)=>b.rating-a.rating);
        fs.writeFileSync(__dirname+'/../data/_results/rating_percentile.json',JSON.stringify(songsArray));
        var json = songsArray
        var fields = Object.keys(json[0])
        var replacer = function(key, value) { return value === null ? '' : value } 
        var csv = json.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
        })
        csv.unshift(fields.join(',')) // add header column
        csv = csv.join('\r\n');
        fs.writeFileSync(__dirname+'/../data/_results/rating_percentile.csv',csv);
        //console.log(songsArray);
        let inew=files.length;
        console.log(songsArray.length)
        songsArray.forEach(el=>{
            let filecontents = fs.readFileSync(directory+el.id+'.json');
            filecontents = JSON.parse(filecontents);
            //filecontents = {...filecontents, ...{rating_percentile:inew/files.length*100}}
            filecontents["rating_percentile"] = inew/files.length*100;
            fs.writeFileSync(directory+el.id+'.json',JSON.stringify(filecontents));
            inew--;
            console.log('Writing: '+inew+'/'+files.length);
        })
    })    
}