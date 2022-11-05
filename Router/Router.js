const Router = require('express').Router()
const RandomPicture = require('../middleware/UnsplashAPI/RandomPic');
const UserLookup = require('../middleware/UnsplashAPI/UserLookup');
const PhotoMetaData = require('../middleware/UnsplashAPI/PhotoMetaData');
const SearchPhotos = require('../middleware/UnsplashAPI/SearchPhotos');
const fs = require('fs');
const path = require('path');

Router.get('/', (req, res, next) => {
    res.sendStatus(200)
})
Router.get('/api/pictures-random', async (req, res, next) => {
    await new RandomPicture({res: res}).getRandomPicture()    
})
Router.get('/api/user-lookup', async (req, res, next) => {    
    await new UserLookup({res: res, userName: req.query.userName}).LookupUser()    
})
Router.get('/api/user-lookup/photos', async (req, res, next) => {    
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserPhotos()    
})
Router.get('/api/user-lookup/statics', async (req, res, next) => {    
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserStatics()    
})
Router.get('/api/user-lookup/collections', async (req, res, next) => { 
    await new UserLookup({res: res, userName: req.query.userName}).LookupUserCollection()
})

Router.get('/api/photo-lookup/statics', async (req, res, next) => {    
    await new PhotoMetaData({res: res, photoID: req.query.photoID}).PhotoMetaData()    
})
Router.get('/api/search/photos', async (req, res, next) => { 
    await new SearchPhotos({res: res, query: req.query.query}).SearchPhotos()
})

module.exports = Router