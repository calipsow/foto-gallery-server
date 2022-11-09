const axios = require('axios');
const fs = require('fs');
const path = require('path');


module.exports = class PhotoMetaData {
    constructor(props){
        this.res = props.res;
        this.photoID = props.photoID;
        if(!this.photoID) throw new Error('photo ID must be provided');

    }

    PhotoMetaData = async () => {
        const cachePath = '../../cached_files/PhotolookupCache/PhotoMetaData.json'
        var cachedRequest = await getCachedRequest(cachePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp
        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data ,message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
        }else{
            let apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/photos/${this.photoID}/statistics?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
            var data = await axios.get(apiUrl)
            .catch(err=>{
                this.res.json({ response: cachedRequest.data })
                return cachedRequest;
            })
            if(typeof data == 'boolean') return;

            data = data.data;
            await SaveData( data, cachePath )
            this.res.json({ response: data })
        }
    }
}


const getCachedRequest = async (filePath) => {
    return new Promise((resolve, reject) => {
        try{
            var data = fs.readFileSync(path.join(__dirname, filePath))
            data = JSON.parse(data)
            return resolve(data);
        
        }catch(err){
            fs.writeFile(path.join(__dirname, filePath), JSON.stringify({timestamp: 0, data: []}))
            console.log(err)
            return getCachedRequest(filePath)
        }
    })
}

const SaveData = async (data, filePath) => {
    new Promise((resolve, reject) => {
        try{
            fs.writeFile(path.join(__dirname, filePath), JSON.stringify({ timestamp: new Date().getTime(), data: data }), () => resolve() ) 

        }catch(err){

            reject(err)
        }
    })
}