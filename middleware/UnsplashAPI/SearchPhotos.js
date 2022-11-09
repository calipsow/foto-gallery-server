const axios = require('axios');
const fs = require('fs');
const path = require('path');


module.exports = class SearchPhotos{
    constructor(props){
        this.res = props.res
        this.query = props.query
        this.pageCount = props.pageCount || '2'
        this.per_page = props.per_page || '30'
        this.color = props.color || null
        this.orientation = props.orientation || null
        this.photoID = props.photoID 
        if( typeof this.orientation === 'string' ){
            if(!['landscape','portrait','squarish'].includes(this.orientation.toLowerCase())) this.orientation = null;
        }
    }

    SearchPhotos = async () => {
        let apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/search/photos?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=${this.query}&page_count=${this.pageCount}&per_page=${this.per_page}`
        console.log(apiUrl)

        const cachePath = '../../cached_files/PhotolookupCache/SearchPhotos.json'
        let cached = getCachedRequest(cachePath)
        let timeDiff = new Date().getTime() - cached.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cached.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds'})
            return;

        }else{

            let data = await axios.get(apiUrl).catch(err=>{
                this.res.json({ response: cached.data })
                return false;
            })
            if(typeof data == 'boolean') return;

            data = data.data;
            await SaveData(data, cachePath)
            this.res.json({response: data}) 
    
        }
    }

    SearchPhotoID = async () => {
        let apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/photos/${this.photoID}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`


        const cachePath = '../../cached_files/PhotolookupCache/SearchPhotoID.json'
        let cached = getCachedRequest(cachePath)
        let timeDiff = new Date().getTime() - cached.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cached.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds'})
            return;

        } else {

            let data = await axios.get(apiUrl).catch(err=>{
                console.log(cached.data)
                this.res.json({ response: cached.data })
                return false;
            })
            if( typeof data == 'boolean' ) return;

            data = data.data;
            await SaveData(data, cachePath)
            this.res.json({response: data}) 
    
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