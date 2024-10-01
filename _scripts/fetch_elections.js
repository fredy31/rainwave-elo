const config = require('../config.json');

async function fetch_elections(){

    try{
        const response = await fetch('https://rainwave.cc/api4/info?user_id='+config.user_id+'&key='+config.key+'&sid=5&per_page=999',{
            method: 'GET',
        })
        if(!response.ok){
            throw new Error(`response status: ${response.status}`)
        }
        const json = await response.json();
        console.log(json.sched_history[0].songs);
    }catch(error){
        console.error(error.message)
    }
}

fetch_elections();