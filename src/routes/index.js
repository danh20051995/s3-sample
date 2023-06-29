const { PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { createPresignedPost } = require('@aws-sdk/s3-presigned-post')
const s3Client = require('../utils/s3-client')

const routes = require('express').Router()

/**
 * Handle upload of text to S3
 */
routes.post('/text', async (req, res) => {
  const timestamp = Date.now()
  const Key = `text/${timestamp}.json`
  const Body = JSON.stringify({
    timestamp,
    text: req.body.text
  }, null, 2)

  if (!Body) {
    return res.status(400).json({
      message: 'Missing text in request body'
    })
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: s3Client.Bucket,
      Body,
      Key
    })
  )

  return res.json({
    message: 'Text uploaded successfully',
    url: await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: s3Client.Bucket, Key }),
      // 24hrs
      { expiresIn: 60 * 60 * 24 }
    )
  })
})

/**
 * Get signed url of file from S3
 */
routes.get('/sign', async (req, res) => {
  const Key = req.query.key ||req.query.Key
  return res.json({
    url: await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: s3Client.Bucket,
        Key
      }),
      // 24hrs
      { expiresIn: 60 * 60 * 24 }
    )
  })
})

/**
 * Handle sign upload url of binary file to S3
 */
routes.get('/upload/sign', async (req, res) => {
  const { mimeType } = req.query
  if (!mimeType) {
    return res.status(400).json({
      message: 'Missing mimeType in request query'
    })
  }

  const response = await createPresignedPost(
    s3Client,
    {
      Bucket: s3Client.Bucket,
      Key: `binary/${Date.now()}`,
      Conditions: [['starts-with', '$Content-Type', mimeType.split('/')[0] + '/']],
      Fields: {},
      // 24hrs before the presigned post expires. 3600 by default.
      Expires: 60 * 60 * 24,
    }
  )

  return res.json(response)
})

/**
 * Notice backend that upload is complete then backend sign url and response to frontend
 */
routes.post('/upload/complete', (req, res) => {
  console.log('TODO: handle complete upload', req.body)
  return res.status(204).end()
})

/**
 * SECTION: Not implemented yet
 */
// routes.get('/multipart/sign', (req, res) => {
//   console.log({ req, res })
//   return res.json({})
// })

// routes.post('/multipart/complete', (req, res) => {
//   console.log({ req, res })
//   return res.json({})
// })

// routes.delete('/multipart/abort', (req, res) => {
//   console.log({ req, res })
//   return res.json({})
// })
/**
 * SECTION: Not implemented yet
 */

module.exports = routes
