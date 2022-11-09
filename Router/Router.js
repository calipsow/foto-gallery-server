const Router = require('express').Router()
const RandomPicture = require('../middleware/UnsplashAPI/RandomPic');
const UserLookup = require('../middleware/UnsplashAPI/UserLookup');
const PhotoMetaData = require('../middleware/UnsplashAPI/PhotoMetaData');
const SearchPhotos = require('../middleware/UnsplashAPI/SearchPhotos');


Router.get('/', (req, res, next) => {
    res.sendStatus(200)
})
Router.get('/api/pictures-random', async (req, res, next) => {
    console.log('received request random image')
    await new RandomPicture({res: res, pageCount: req.query.pageCount || undefined}).getRandomPicture()    
})
Router.get('/api/user-lookup', async (req, res, next) => {    
    console.log('received request user data')
    await new UserLookup({res: res, userName: req.query.userName}).LookupUser()    
})
Router.get('/api/user-lookup/photos', async (req, res, next) => {
    console.log('received request user images')    
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserPhotos()    
})
Router.get('/api/user-lookup/statics', async (req, res, next) => {
    console.log('received request image statistics')    
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserStatics()    
})
Router.get('/api/user-lookup/collections', async (req, res, next) => { 
    console.log('received request collections')
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserCollection()
})
Router.get('/api/user-lookup/likes', async (req, res, next) => { 
    console.log('received request likes')
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserLikedPhotos()
})

Router.get('/api/photo-lookup/statics', async (req, res, next) => {    
    console.log('received request user statistics')
    await new PhotoMetaData({res: res, photoID: req.query.photoID}).PhotoMetaData()    
})
Router.get('/api/search/photos', async (req, res, next) => { 
    console.log('received request photos')
    await new SearchPhotos({res: res, query: req.query.query, pageCount: req.query.pageCount}).SearchPhotos()
})
Router.get('/api/search/photo-id', async (req, res, next) => { 
    console.log('received request photo id')
    await new SearchPhotos({res: res, query: req.query.query, photoID: req.query.photoID}).SearchPhotoID()
})
Router.get('/api/user/authenticated/profile',async (req, res, next)=>{
    console.log('received request authenticated user')
    await new UserLookup({res: res, token: req.query.token}).AuthorizedUserProfile()
})

Router.get('/api/user/authenticated/profile/update',async (req, res, next)=>{
    console.log('received request authenticated user')
    let data = {}
    data.username = req.query.username; data.firstName = req.query.firstName; data.lastName = req.query.lastName; 
    data.email = req.query.email; data.url = req.query.url; data.instagram_username = req.query.instagram_username;
    data.bio = req.query.bio; data.location = req.query.location; 
    await new UserLookup({res: res, token: req.query.token, data: data}).UpdateUserInformation()
})

module.exports = Router