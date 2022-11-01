const axios = require('axios');
const fs = require('fs');
const path = require('path');




module.exports = class UserLookup {
    constructor(props){
        this.res = props.res
        this.userName = props.userName
        this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/users/${this.userName}?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
        if(!this.userName) throw new Error('User Name must be provided')

    }

    LookupUser = async () => {
        const cachePath = '../../cached_files/UserlookupCache/UserLookupCounter.json'
        var cachedRequest = await getCachedRequest(cachePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp
        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
        }else{
            this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/users/${this.userName}?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
            var data = await axios.get(this.apiUrl)
            data = data.data;
            await SaveData( data, cachePath )
            this.res.json({ response: data })
        }
    }

    LookupUserPhotos = async () => {
        const filePath = '../../cached_files/UserlookupCache/UserLookupPhotos.json'
        var cachedRequest = await getCachedRequest(filePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
        }else{
            this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/users/${this.userName}/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
            var data = await axios.get(this.apiUrl)
            data = data.data;
            await SaveData( data, filePath )
            this.res.json({ response: data })
        }
    }

    LookupUserStatics = async () => {
        const filePath = '../../cached_files/UserlookupCache/UserLookupStatistics.json'
        var cachedRequest = await getCachedRequest(filePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
        }else{
            this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/users/${this.userName}/statistics?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
            var data = await axios.get(this.apiUrl)
            data = data.data;
            await SaveData( data, filePath )
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
            console.error(err)
            return reject(err);
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