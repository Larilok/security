import fastify from 'fastify'
import staticMiddleware from 'fastify-static'
import path from 'path'
import fs from 'fs'

import createRoutes from './router'

const app = fastify({
  logger: true,
  https: {
    key: fs.readFileSync(path.join(__dirname, '..', 'https', 'eckey.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'https', 'ec_t.pem')),
    minVersion: 'TLSv1.3',
    ciphers:  
            'TLS_CHACHA20_POLY1305_SHA256' + ':' +
            'TLS_AES_256_GCM_SHA384' + ':' +
            'TLS_AES_128_GCM_SHA256' + ':' +
            'TLS_AES_128_CCM_8_SHA256' + ':' +
            'TLS_AES_128_CCM_SHA256',
    honorCipherOrder: true
  }
})

app.register(staticMiddleware, {
  root: path.join(__dirname, 'static')
})

createRoutes(app)

app.listen(8888)