const { S3Client, HeadBucketCommand, CreateBucketCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3')

const Bucket = process.env.AWS_BUCKET_NAME

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT,
  tls: process.env.AWS_ENDPOINT.startsWith('https'),
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
})

;(async () => {
  const CORSConfiguration = {
    CORSRules: [{
      AllowedHeaders: ['*'],
      AllowedMethods: [
        'GET',
        'HEAD',
        'PUT',
        'POST',
        'DELETE'
      ],
      AllowedOrigins: ['*'],
      ExposeHeaders: ['ETag']
    }]
  }

  /**
   * Ensure bucket exists
   */
  await s3Client.send(new HeadBucketCommand({ Bucket })).catch(
    () => s3Client.send(new CreateBucketCommand({ Bucket }))
  )

  /**
   * Update cors configuration for a bucket
   */
  await s3Client.send(new PutBucketCorsCommand({ Bucket, CORSConfiguration })).catch(
    (error) => console.log(`(If using minio it's fine) Error updating cors configuration for bucket ${Bucket}:`, error.message)
  )
})()

module.exports = s3Client
module.exports.Bucket = Bucket
