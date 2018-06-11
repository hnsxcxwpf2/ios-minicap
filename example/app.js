const http = require('http')
const path = require('path')
const net = require('net')
const oboe = require('oboe')
const rp = require('request-promise')

const express = require('express')
const WebSocketServer = require('ws').Server
const debug = require('debug')('example')
const { Parser } = require('minicap')

const app = express()

const PORT = process.env.PORT || 9002
const MINICAP_PORT = process.env.MINICAP_PORT || 12345
const WDA_PORT = process.env.WDA_PORT || 8100
const WDA_URL = `http://localhost:${WDA_PORT}/`

app.use(express.static(path.join(__dirname, '/public')))
app.get('/config.js', (req, res) => {
  res.status(200)
    .type('js')
    .send(`var WSURL = "ws://localhost:${PORT}"`)
})

// ******** [START] WebDriverAgent相关操作 ********
app.get('/ios/getDeviceInfo', (req, res) => {
  res.send('/ios/getDeviceInfo')
})

app.get('/ios/home', (req, res) => {
  var url = WDA_URL + 'wda/homescreen'
  var options = {
    method: 'POST'
    , uri: url
  }

  rp(options)
    .then(parsedBody => {
      res.status(200)
        .type('json')
        .send(parsedBody)
    })
})

app.get('/windowsize', (req, res) => {
  // not implement yet
})

app.get('/ion/inputText', (req, res) => {
  console.log('/ios/inputText')
  oboe(WDA_URL + 'status')
    .node('sessionId', sessionId => {
      var url = WDA_URL + 'session' + sessionId + '/wda/keys'
      var options = {
        method: 'POST'
        , uri: url
        , body: {
            value: req.query.value
          }
        , json: true
      }
    })
})

app.get('/ios/tap', (req, res) => {
  console.log('/ios/tap')
  console.log(`{"x": "${req.query.x}", "y": "${req.query.y}"}`)

  oboe(WDA_URL + 'status')
    .node('sessionId', sessionId => {
      var url = WDA_URL + 'session/' + sessionId + '/wda/tap/0'
      var options = {
        method: 'POST'
        , uri: url
        , body: {
            x: req.query.x
          , y: req.query.y
        }
        , json: true
      }

      rp(options)
        .then(parsedBody => {
          console.log(parsedBody)

          if(JSON.stringify(parsedBody).indexOf('Session does not exist') > -1) {
            oboe(WDA_URL + 'status')
              .node('sessionId', sessionId2 => {
                var url2 = WDA_URL + 'session/' + sessionId2 + '/wda/tap/0'
                var options2 = {
                  method: 'POST'
                  , uri: url
                  , body: {
                      x: req.query.x
                      , y: req.query.y
                    }
                  , json: true
                }

                rp(options2)
                  .then(parsedBody2 => {
                    res.json(parsedBody2)
                  })
                  .catch(err => {
                    res.send(err)
                  })
              })
          }

          console.log(parsedBody)
          res.json(parsedBody)
        })
    })

})

app.get('/ios/tapHold', (req, res) => {
    console.log('/ios/tabHold')
    console.log(`{"x": "${req.query.x}", "y": "${req.query.y}", "duration": "${req.query.duration}"`)

    oboe(WDA_URL + 'status')
      .node('sessionId', sessionId => {
        var url = WDA_URL + 'session/' + sessionId + '/wda/touchandhold'
        var options = {
          method: 'POST'
          , uri: url
          , body: {
              x: req.query.x
              , y: req.query.y
              , duration: req.query.duration
            }
          , json: true
        }

        rp(options)
          .then(parsedBody => {
            console.log(parsedBody)

            if(JSON.stringify(parsedBody).indexOf('Session does not exist') > -1) {
              oboe(WDA_URL + 'status')
                .node('sessionId', sessionId2 => {
                  var url2 = WDA_URL + 'session/' + sessionId2 + '/wda/touchandhold'
                  var options2 = {
                    method: 'POST'
                    , uri: url2
                    , body: {
                        x: req.query.x
                        , y: req.query.y
                        , duration: req.query.duration
                      }
                    , json: true
                  }

                  rp(options2)
                    .then(parsedBody2 => {
                      res.json(parsedBody2)
                    })
                    .catch(err => {
                      res.send(err)
                    })
                })
            }

            console.log(parsedBody)
            res.json(parsedBody)
          })
      })

})

app.get('/ios/swipe', (req, res) => {
  console.log('/ios/swipe')
  console.log(`{"fromX": "${req.query.fromX}", "fromY": "${req.query.fromY}", "toX": "${req.query.toX}", "toY": "${req.query.toY}", "duration": "${req.query.duration}"}`)

  oboe(WDA_URL + 'status')
    .node('sessionId', sessionId => {
      var url = WDA_URL + 'session/' + sessionId + '/wda/dragfromtoforduration'
      var options = {
        method: 'POST'
        , uri: url
        , body: {
            fromX: req.query.fromX
            , fromY: req.query.fromY
            , toX: req.query.toX
            , toY: req.query.toY
            , duration: req.query.duration
          }
        , json: true
      }

      rp(options)
        .then(parsedBody => {
          console.log(parsedBody)

          if(JSON.stringify(parsedBody).indexOf('Session does not exist') > -1) {
            oboe(WDA_URL + 'status')
              .node('sessionId', sessionId2 => {
                var url2 = WDA_URL + 'session/' + sessionId2 + '/wda/dragfromtoforduration'
                var options2 = {
                  method: 'POST'
                  , uri: url2
                  , body: {
                      fromX: req.query.fromX
                      , fromY: req.query.fromY
                      , toX: req.query.toX
                      , toY: req.query.toY
                      , duration: req.query.duration
                    }
                  , json: true
                }

                rp(options2)
                  .then(parsedBody2 => {
                    res.json(parsedBody2)
                  })
                  .catch(err => {
                    res.send(err)
                  })
              })
          }

          console.log(parsedBody)
          res.json(parsedBody)
        })
    })

})
// ******** [END] WebDriverAgent相关操作 ********

const server = http.createServer(app)
const wss = new WebSocketServer({ server: server })

wss.on('connection', (ws) => {
  console.info('Got a client')

  const stream = net.connect({
    port: MINICAP_PORT
  })

  stream.on('error', (err) => {
    console.error(err)
    console.error('Be sure to run ios-minicap on port ' + MINICAP_PORT)
    process.exit(1)
  })

  function onBannerAvailable (banner) {
    debug('banner', banner)
  }

  function onFrameAvailable (frame) {
    ws.send(frame.buffer, {
      binary: true
    })
  }

  const parser = new Parser({
    onBannerAvailable,
    onFrameAvailable
  })

  function tryParse () {
    for (let chunk; (chunk = stream.read());) {
      parser.parse(chunk)
    }
  }

  stream.on('readable', tryParse)
  tryParse()

  ws.on('close', () => {
    console.info('Lost a client')
    stream.end()
  })
})

server.listen(PORT)
console.info(`Listening on port ${PORT}`)
