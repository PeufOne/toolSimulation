var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var mongoose = require('mongoose')
var config = require('./config')


//Connection BDD
mongoose.connect(config.DBPATH, {useNewUrlParser: true, useCreateIndex: true})

var app = express()
var server = require('http').Server(app)
//var io = require('socket.io')(server)
server.listen(config.PORT, () => {
  console.log(`En écoute sur le port ${config.PORT}`)
})

/*
io.on('connection', function (socket) {
  console.log('new socket')
  socket.emit('news', { hello: 'world' })
  socket.on('disconnect', function () {
    console.log(`Socket ${socket.id} disconnected`)
  })
})

app.use((req, res, next) => {
  req.io = io
  next()
})
*/


// middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public', 'views')))

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
app.use('/tools', require('./routes/tools'))
app.use('/articles', require('./routes/articles'))
app.use('/actions', require('./routes/actions'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)

  res.json({error: true, message: err.message})

})

module.exports = app
