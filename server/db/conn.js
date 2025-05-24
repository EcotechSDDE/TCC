const { MongoClient } = require("mongodb")
const Db = "mongodb+srv://ecotechsdee:dlpiYMQQGi5sVm3E@cluster0.7mfl0lv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var _db

module.exports = {
    connectToMongoDB: async function (callback) {
        try {
            await client.connect()
            _db = client.db("usuarios") // Nome do BANCO DE DADOS
            console.log("Conectado ao MongoDB.")
            
            return callback(null)
        } catch (error) {
            return callback(error)
        }
    },

    getDb: function () {
        return _db
    }
}
