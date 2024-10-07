const fs = require('node:fs');

// Make it possible to call both functions from the package.json
for(var i=0;i<process.argv.length;i++){
    switch(process.argv[i]){
        case 'daily':
            build_export_csv(1,process.argv[i]);
            return false;
            break;
        case 'weekly':
            build_export_csv(7,process.argv[i]);
            return false;
            break;
        case 'monthly':
            build_export_csv(365/12,process.argv[i]);
            return false;
            break;
        case 'endresult':
            build_export_csv(99999,process.argv[i]);
            return false;
            break;
    }
}
module.exports.build_export_csv = build_export_csv
function build_export_csv(daysBetweenPicks=1,fileSuffix=''){
    let possibledays = [];
    let csvExport = [];
    let directory = __dirname+'/../data/elo/';
    // First, figure out the columns of the end CSV. So we have to figure out any day that will be in the scoresheet.
    fs.readdir(directory, (err, files) => {
        if (err) throw err;
        let i=1;
        for (const file of files) {
            //console.log(file);
            i++;
            if(file != '.gitignore'){
                let filecontents = fs.readFileSync(directory+file);
                filecontents = JSON.parse(filecontents);
                filecontents.forEach(fc=>{
                    let date = new Date(fc.time*1000);
                    let month = ('0' + (date.getMonth()+1)).slice(-2)
                    let day = ('0' + (date.getDate())).slice(-2)
                    let scoreDate = date.getFullYear()+'-'+month+'-'+day;
                    if(!possibledays.includes(scoreDate)){
                        possibledays.push(scoreDate);
                    }
                })
                console.log(Math.round(i/files.length*100)+'% ('+i+"/"+files.length + ') done! ' +possibledays.length + ' days with scores');
            }
        }
        possibledays.sort();
        for (const file of files) {
            if(file != '.gitignore'){
                let elocontent = fs.readFileSync(directory+file);
                elocontent = JSON.parse(elocontent);
                let songcontent = {};
                try{
                    songcontent = fs.readFileSync(directory+'../songs/'+file);
                    songcontent = JSON.parse(songcontent);
                }catch(err){
                    console.error(err);
                }
                let dailyElo = {};
                let currentLookedForDay = Date.parse(possibledays[0])/1000;
                if(daysBetweenPicks != 99999){
                    elocontent.forEach(elo=>{
                        if(elo.time>currentLookedForDay){
                            let date = new Date(elo.time*1000);
                            let month = ('0' + (date.getMonth()+1)).slice(-2)
                            let day = ('0' + (date.getDate())).slice(-2)
                            dailyElo[date.getFullYear()+'-'+month+'-'+day] = elo.score;
                            currentLookedForDay+=(60*60*24*daysBetweenPicks);
                        }
                    })
                    let previousResult = 1000;
                    if(daysBetweenPicks == 1){
                        possibledays.forEach(day=>{
                            if(dailyElo[day]){
                                previousResult = dailyElo[day];
                            }else{
                                dailyElo[day] = previousResult;
                            }
                        })
                    }
                    let toCleanup = dailyElo;
                    dailyElo = Object.keys(toCleanup).sort().reduce(
                        (obj, key) => { 
                            obj[key] = toCleanup[key]; 
                            return obj;
                        }, 
                        {}
                    );
                }else{
                    let currentScore = 0;
                    let currentTime = 0;
                    elocontent.forEach(elo=>{
                        if(currentTime<elo.time){
                            currentScore = elo.score;
                            currentTime = elo.time;
                        }
                    })
                    dailyElo['Current score'] = currentScore;
                }
                //console.log(songcontent);
                if(songcontent){
                    addToExport = {...songcontent,...dailyElo};
                }else{
                    addToExport = {...dailyElo};
                }
                csvExport.push(addToExport);
            }
        }
        if(daysBetweenPicks != 99999){
            csvExport.sort(function(a,b){
                return b[possibledays[possibledays.length-1]]-a[possibledays[possibledays.length-1]]
            })
        }else{
            csvExport.sort(function(a,b){
                return b["Current score"]-a["Current score"]
            })
        }
        //console.log(JSON.stringify(csvExport))
        fs.writeFileSync(__dirname+'/../data/_results/results-'+fileSuffix+'.json',JSON.stringify(csvExport));

        var json = csvExport
        var fields = Object.keys(json[0])
        var replacer = function(key, value) { return value === null ? '' : value } 
        var csv = json.map(function(row){
        return fields.map(function(fieldName){
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
        })
        csv.unshift(fields.join(',')) // add header column
        csv = csv.join('\r\n');
        fs.writeFileSync(__dirname+'/../data/_results/results-'+fileSuffix+'.csv',csv);

        console.log('DONE! Check the data folder for results.')
    })
}