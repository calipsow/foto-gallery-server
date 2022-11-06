const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = class RandomPicture {
    constructor(props){
        this.res = props.res;
        this.apiDomain = process.env.UNSPLAH_API_DOMAIN
        this.accessKey = process.env.UNSPLASH_ACCESS_KEY
        this.page = props.pageCount || this.generateRandomInt(30).toString()
        this.apiUrl = `${this.apiDomain}/photos/?client_id=${this.accessKey}&page=${this.page}&per_page=70&order_by=popular`;
    }
    generateRandomInt = (max=30) => {
        let int = Math.floor(Math.random() * max);
        if( int === 0 ) int = 1;
        return int;
    }
    getRandomPicture = async () => {
        var cache = await getCachedPhotos()

        if( new Date().getTime() - cache.timestamp < 144000 ){
            console.log('send data from cache next request in ' +  cache.timestamp - new Date().getTime() );
            this.res.json({ response: cache.data })
            return;

        }else{

            let response = await axios.get(this.apiUrl,{headers:{'Accept-Version':'v1'}})
            response = response.data;
    
            await SaveData( response )
            console.log('send data from API')
            this.res.json({response: response})
    
        }
    }
    
}

const getCachedPhotos = async () => {
    return new Promise((resolve, reject) => {
        try{
            var data = fs.readFileSync(path.join(__dirname, '../../cached_files/random_cashed_files.json'))
            data = JSON.parse(data)
            return resolve(data);
        
        }catch(err){
            console.error(err)
            return reject(err);
        }
    })
}

const SaveData = async (data) => {
    new Promise((resolve, reject) => {
        try{
            fs.writeFile(path.join(__dirname, '../../cached_files/random_cashed_files.json'), JSON.stringify({ timestamp: new Date().getTime(), data: data }), () => resolve() ) 

        }catch(err){

            reject(err)
        }
    })
}