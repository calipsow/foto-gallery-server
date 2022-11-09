const axios = require('axios');
const fs = require('fs');
const path = require('path');




module.exports = class UserLookup {
    constructor(props){
        this.res = props.res
        this.userName = props.userName || props.token || ''
        this.token = props.token || ''
        this.newData = props.data || null
        this.photo_id = props.photo_id || ''
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
            var data = await axios.get(this.apiUrl).catch(err=>{
                this.res.json({ response: cachedRequest.data })
                return false;
            })
            if(typeof data == 'boolean') return;
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
            var data = await axios.get(this.apiUrl).catch(err=>{
                this.res.json({ response: cachedRequest.data })
                return false;
            })
            if(typeof data == 'boolean') return;
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
            var data = await axios.get(this.apiUrl).catch(err=>{
                this.res.json({ response: cachedRequest.data })
                return false;
            })
            if(typeof data == 'boolean') return;

            data = data.data;
            await SaveData( data, filePath )
            this.res.json({ response: data })
        }
    }
    LookupUserCollection = async () => {
        const filePath = '../../cached_files/UserlookupCache/UserLookupCollections.json'
        var cachedRequest = await getCachedRequest(filePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
            return;
        }else{
            this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/users/${this.userName}/collections?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
            var data = await axios.get(this.apiUrl).catch(err=>{
                this.res.json({ response: cachedRequest.data })
                return false;
            })
            if(typeof data == 'boolean') return;

            data = data.data;
            
            await SaveData( data, filePath )
            this.res.json({ response: data })
            return;
        }
    }
    LookupUserLikedPhotos = async () => {
        const filePath = '../../cached_files/UserlookupCache/UserLookupLikedPhotos.json'
        var cachedRequest = await getCachedRequest(filePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
            return;
        }else{
            this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/users/${this.userName}/likes?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 
            var data = await axios.get(this.apiUrl).catch(err=>{
                this.res.json({ response: cachedRequest.data })
                return false;
            })
            if(typeof data == 'boolean') return;
            data = data.data;
            // console.log(data)
            await SaveData( data, filePath )
            this.res.json({ response: data })
            return;
        }
    }

    AuthorizedUserProfile = async () => {
        const filePath = '../../cached_files/UserlookupCache/AuthorizedUser.json'
        var cachedRequest = await getCachedRequest(filePath)
        let timeDiff = new Date().getTime() - cachedRequest.timestamp

        if( timeDiff < 144000 ){
            this.res.json({response: cachedRequest.data, message: 'next request in ' + ( ( 144000 - timeDiff )  / 1000 ) + ' seconds' })
            return;
        }else{
            this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/me?client_id=${process.env.UNSPLASH_ACCESS_KEY}` 

            var data = await axios.get(this.apiUrl,{headers: {
                'Authorization':'Bearer '+this.token
                
            }}).catch(err=>{
                console.error(err);
                this.res.json({ response: cachedRequest.data })
                return false;
            })
            if(typeof data == 'boolean') return;
            data = data.data;
            // console.log(data)
            await SaveData( data, filePath )
            this.res.json({ response: data })
            return;
        }
    }

    UpdateUserInformation = async () => {
        
        let keys = Object.keys(this.newData)
        let queryArr = [], query = ''
        keys.forEach( key => {
            if(!this.newData[key]) return;
            switch(key){
                case 'username': queryArr.push('username='+this.newData[key]); break;
                case 'firstName': queryArr.push('first_name='+this.newData[key]); break;
                case 'lastName': queryArr.push('last_name='+this.newData[key]); break;
                case 'email': queryArr.push('email='+this.newData[key]); break;
                case 'url': queryArr.push('url='+this.newData[key]); break;
                case 'instagram_username': queryArr.push('instagram_username='+this.newData[key]); break;
                case 'bio': queryArr.push('bio='+this.newData[key]); break;
                case 'location': queryArr.push('location='+this.newData[key]); break;
                default: break
            }
        })
        let ix = queryArr.length 
        for(let index in queryArr){
            if( index >= ix - 1 ){
                query += queryArr[index]
            
            }else{
                query += queryArr[index] + '&'
            }
        }

        this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/me?client_id=${process.env.UNSPLASH_ACCESS_KEY}&${query}`
        console.log(this.apiUrl)
        let result = await axios.request(this.apiUrl,{method:'PUT', headers:{'Authorization':'Bearer '+this.token}})
        .then( response => response.data )
        .catch( error => {console.log(error); return false } )
        
        if(typeof result === 'boolean'){
            this.res.json({ response: false })
            return
        }

        this.res.json({response: result})
    }

    LikePhoto = async (like) => {
        this.apiUrl = `${process.env.UNSPLAH_API_DOMAIN}/photos/${this.photo_id}/like?client_id=${process.env.UNSPLASH_ACCESS_KEY}`


        if(like){
            let r = await axios.request(this.apiUrl,{
                method:'POST',
                headers: {
                    'Authorization': 'Bearer '+this.token
                }
            })
            .then( response => response.data )
            .catch( error => {console.log(error); return false })
    
            if( typeof r === 'boolean' ){
                this.res.json({response: false, status: 500})
                return

            } else {
                this.res.json({response: r, status: 200})
                return
            }

        }else{

            let r = await axios.request(this.apiUrl,{
                method:'DELETE',
                headers: {
                    'Authorization': 'Bearer '+this.token
                }
            })
            .then( response => response.data )
            .catch( error => {console.log(error); return false })
    
            if( typeof r === 'boolean' ){
                this.res.json({response: false, status: 500})
                return

            } else {
                this.res.json({response: r, status: 200})
                return
            }

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

            resolve(fs.writeFileSync(path.join(__dirname, filePath), JSON.stringify({ timestamp: new Date().getTime(), data: data }) )) 

        }catch(err){

            reject(err)
        }
    })
}