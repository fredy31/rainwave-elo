const config = require('../config.json');
const fs = require('node:fs');

async function fetch_elections(){
    // Get old elections cache file
    let savedElections = fs.readFileSync(__dirname+'/../data/elections.json');

    // If it screws up, restart from scratch
    if(!savedElections){
        savedElections = JSON.parse("[]");
    }else{
        try{
            savedElections = JSON.parse(savedElections);
        }catch{
            savedElections = JSON.parse("[]");;
        }
    }

    // Go through all 5 radios
    for(var i=1; i<=5; i++){
        try{
            // Fetch of data
            const response = await fetch('https://rainwave.cc/api4/info?user_id='+config.user_id+'&key='+config.key+'&sid='+i,{
                method: 'GET',
            })
            if(!response.ok){
                throw new Error(`response status: ${response.status}`)
            }
            const json = await response.json();
            json.sched_history.forEach((el)=>{
                // Checks which person won or lost, depending on the value in entry_votes.
                // Decided that an election vote via no votes cast doesn't count.
                let winner = 0;
                let winvotes = 0;
                let losers = [];
                el.songs.forEach((song)=>{
                    if(winvotes<song.entry_votes){
                        if(winner){
                            losers.push(winner);
                        }
                        winner = song.id;
                        winvotes = song.entry_votes;
                    }else{
                        losers.push(song.id);
                    }
                })
                
                // Push the result to the array
                if(winner != 0){
                    savedElections.push({
                        election_id:el.id,
                        winner:winner,
                        losers:losers
                    });
                }else{
                    // Probable election won with no votes cast.
                }
            })
        }catch(error){
            console.error(error.message)
        }
    }

    // Remove dupe elections
    let seenElections = [];
    let cleanedElections = [];
    savedElections.forEach((el)=>{
        if(!seenElections.includes(el.election_id)){
            seenElections.push(el.election_id);
            cleanedElections.push(el);
        }
    })

    const date = new Date();
    console.log('Currently saved elections: '+cleanedElections.length+' on '+date.toJSON());
    // Write the cache file.
    try{
        let write = JSON.stringify(cleanedElections);
        fs.writeFileSync(__dirname+'/../data/elections.json',write);
    }catch(err){
        console.error(err);
    }
}

function auto_fetch_elections(){
    fetch_elections();
    setInterval(()=>{
        fetch_elections();
    },1000*60*5);
}

//fetch_elections();
for(var i=0;i<process.argv.length;i++){
    switch(process.argv[i]){
        case 'fetch_elections':
            fetch_elections();
            break;
        case 'auto_fetch_elections':
            auto_fetch_elections();
            break;
    }
}
module.exports.fetch_elections = fetch_elections
module.exports.auto_fetch_elections = auto_fetch_elections