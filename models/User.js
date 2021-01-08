const { Schema, model } = require('mongoose')

const schema = new Schema({
    // _id: {type: String, default: null},
    name: {type: String, required: true},
    picture: {type: String, default: null},
    description: {type: String, default: null}
})

module.exports = model('User', schema)
