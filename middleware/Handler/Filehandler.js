const fs = require('fs')
const path = require('path')

module.exports = class FileSystem{
    constructor(props){
        this.path = props.path
        this.data = props.data || {}
        this.fileName = props.fileName || null         
    }

    writeNewFile = async () => {
        new Promise((resolve, reject) => {
            if(isArray(this.data)){
                this.data = {timespamp: new Date().getTime(), data: this.data}
            }
            fs.writeFileSync(path.join(__dirname, `../../${this.path}`), this.data)
        })
    }
}