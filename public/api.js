async function uploadBinaryFile(file) {
  try {
    const { data: { url, fields } } = await axios.get('/api/upload/sign', { params: { mimeType: file.type } })

    const formData = new FormData()
    formData.append('Content-Type', file.type)
    for (const key of Object.keys(fields)) {
      formData.append(key, fields[key])
    }
    formData.append('file', file)

    // upload file to S3 and notice backend that upload is complete
    await axios.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    await axios.post('/api/upload/complete', { key: fields.key })

    // get signed url of uploaded file
    const { data: { url: signedUrl } } = await axios.get('/api/sign', { params: { key: fields.key } })
    const link = document.createElement('a')
    link.href = signedUrl
    link.target = '_blank'
    link.innerText = `File upload result: ${signedUrl}`
    document.body.appendChild(link)
  } catch (error) {
    alert(error.response?.data?.message || 'Unknown error')
  }
}

function uploadText(text) {
  return axios.post('/api/text', { text })
    .then(({ data }) => {
      const { url } = data
      const link = document.createElement('a')
      link.href = url
      link.target = '_blank'
      link.innerText = `Text upload result: ${url}`
      document.body.appendChild(link)
    })
    .catch((error) => alert(error.response?.data?.message || 'Unknown error'))
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.forms[0]

  form.onsubmit = function (event) {
    // prevent default action
    event.preventDefault()

    const [file] = form.elements['fileInput'].files
    if (file) {
      uploadBinaryFile(file).then(
        () => (form.elements['fileInput'].value = '')
      )
    }

    const text = form.elements['textInput'].value
    if (text) {
      uploadText(text).then(
        () => (form.elements['textInput'].value = '')
      )
    }
  }
})