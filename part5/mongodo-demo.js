const { MongoClient } = require('mongodb')

const client = new MongoClient('mongo:127.0.0.1:27017')

async function mongoConnect() {
  try {
    await client.connect()
  } catch (err) {
    console.log(err)
  } finally {
    client.close()
  }
}

mongoConnect()
