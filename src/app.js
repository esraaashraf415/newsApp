const express = require('express')
const reportRouter = require('./router/report')
const newsRouter = require('./router/news')
const app = express()
// require('dotenv').config()
const port = process.env.PORT || 7000

require('./db/mongoose')

app.use(express.json())
app.use(reportRouter)
app.use(newsRouter)


app.listen(port,()=>{console.log('Server is running', port)})
