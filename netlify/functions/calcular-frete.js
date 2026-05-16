const ME_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGQ2NmM1MGEwZGIyNWU1YzNiMjI5NDRmMjBhNzY3YTYzZjE4MGE5MzRiOWExNmVmYzhjYTk2YTY1NDVjNTUyMmRhNDFlOWY4NzM1Yzc3ZjQiLCJpYXQiOjE3Nzg4Nzg0MzMuOTYzODMsIm5iZiI6MTc3ODg3ODQzMy45NjM4MzIsImV4cCI6MTgxMDQxNDQzMy45NTIxMDUsInN1YiI6ImNiN2FmMWMzLWEyOWMtNDFhOS04MjBlLWY1MDFmYTlkMmNmOSIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYWF0ZSIsInNoaXBwaW5nLXByZXZpZXciLCJzaGlwcGluZy1wcmludCIsInNoaXBwaW5nLXNoYXJlIiwic2hpcHBpbmctdHJhY2tpbmciLCJlY29tbWVyY2Utc2hpcHBpbmciLCJ0cmFuc2FjdGlvbnMtcmVhZCIsInVzZXJzLXJlYWQiLCJ1c2Vycy13cml0ZSIsIndlYmhvb2tzLXJlYWQiLCJ3ZWJob29rcy13cml0ZSIsIndlYmhvb2tzLWRlbGV0ZSIsInRkZWFsZXItd2ViaG9vayJdfQ.X2AxXskuHUqm31vcnY2itON179pqqVHc46rGdbwRAQKCfvRN8kSuZs4Wauhu98ehx6eDZbtuzRW-ZDPqW70A0sjPzgxQ66WyBISbtS8Uh0rsK7xkfUE76NoqKez-1z7N-qWzPVWLm75nCggT8NI5i2zUfLdLy2PGlo9lFZP3ehU2ejJvCBYJVoMobs9OEd45FnornU8OglFFUq96nQ55RD8fhWFxbeEYr4d8wb2t8LRLS2KJks-LMbKtQpqgLgURAoUc4A2WdGtZY8LohTUwiuQeImc8Qm0GNjUgTyaMsKLViBEYZ3KTCgt9j4FPnOsG8ZsDedXee4Rm-6yzABb7AAAlSYSyyn9VQf1QMcoRnzcBZVuChSWHRjHOqy97cdQVlvzhIWdIdP4cDJEL0sHiQ7xaaRTvkSKJGCcd9DGncwecSqIR1gBQBAPI7-pf_YeSNK29YmeqJLx0gbJ8L49VZT5ZMV9hByOQjohGLzKaKfLRPdeyabrjrkMFwSXEbtcvdmIOBZlgKHeSK2yoHxce4h7J5xrOVEtggUZSIpu0awhngbX-NgT0Kem1dqOBqKfg1MvrHN2RnwbeW5jMvgFhqmI9dUxgdoeo5YkzW6GvvJHlm6i4fVAWjW3HAWQw96mIXIrf6IErBXVkRFNUYh-G4LGyUoXGKL9UwVq16RWLooc'
const ME_CEP_ORIGEM = '18607289'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  console.log('Função iniciada', event.body)

  try {
    const { cepDestino, peso, quantidade } = JSON.parse(event.body)

    const requestBody = JSON.stringify({
      from: { postal_code: ME_CEP_ORIGEM },
      to: { postal_code: cepDestino },
      products: [
        {
          id: '1',
          width: 15,
          height: 15,
          length: 15,
          weight: peso / 1000,
          insurance_value: 0,
          quantity: quantidade,
        },
      ],
    })

    console.log('Chamando API Melhor Envio', requestBody)

    const res = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNGQ2NmM1MGEwZGIyNWU1YzNiMjI5NDRmMjBhNzY3YTYzZjE4MGE5MzRiOWExNmVmYzhjYTk2YTY1NDVjNTUyMmRhNDFlOWY4NzM1Yzc3ZjQiLCJpYXQiOjE3Nzg4Nzg0MzMuOTYzODMsIm5iZiI6MTc3ODg3ODQzMy45NjM4MzIsImV4cCI6MTgxMDQxNDQzMy45NTIxMDUsInN1YiI6ImNiN2FmMWMzLWEyOWMtNDFhOS04MjBlLWY1MDFmYTlkMmNmOSIsInNjb3BlcyI6WyJjYXJ0LXJlYWQiLCJjYXJ0LXdyaXRlIiwiY29tcGFuaWVzLXJlYWQiLCJjb21wYW5pZXMtd3JpdGUiLCJjb3Vwb25zLXJlYWQiLCJjb3Vwb25zLXdyaXRlIiwibm90aWZpY2F0aW9ucy1yZWFkIiwib3JkZXJzLXJlYWQiLCJwcm9kdWN0cy1yZWFkIiwicHJvZHVjdHMtZGVzdHJveSIsInByb2R1Y3RzLXdyaXRlIiwicHVyY2hhc2VzLXJlYWQiLCJzaGlwcGluZy1jYWxjdWxhdGUiLCJzaGlwcGluZy1jYW5jZWwiLCJzaGlwcGluZy1jaGVja291dCIsInNoaXBwaW5nLWNvbXBhbmllcyIsInNoaXBwaW5nLWdlbmVyYXRlIiwic2hpcHBpbmctcHJldmlldyIsInNoaXBwaW5nLXByaW50Iiwic2hpcHBpbmctc2hhcmUiLCJzaGlwcGluZy10cmFja2luZyIsImVjb21tZXJjZS1zaGlwcGluZyIsInRyYW5zYWN0aW9ucy1yZWFkIiwidXNlcnMtcmVhZCIsInVzZXJzLXdyaXRlIiwid2ViaG9va3MtcmVhZCIsIndlYmhvb2tzLXdyaXRlIiwid2ViaG9va3MtZGVsZXRlIiwidGRlYWxlci13ZWJob29rIl19.X2AxXskuHUqm31vcnY2itON179pqqVHc46rGdbwRAQKCfvRN8kSuZs4Wauhu98ehx6eDZbtuzRW-ZDPqW70A0sjPzgxQ66WyBISbtS8Uh0rsK7xkfUE76NoqKez-1z7N-qWzPVWLm75nCggT8NI5i2zUfLdLy2PGlo9lFZP3ehU2ejJvCBYJVoMobs9OEd45FnornU8OglFFUq96nQ55RD8fhWFxbeEYr4d8wb2t8LRLS2KJks-LMbKtQpqgLgURAoUc4A2WdGtZY8LohTUwiuQeImc8Qm0GNjUgTyaMsKLViBEYZ3KTCgt9j4FPnOsG8ZsDedXee4Rm-6yzABb7AAAlSYSyyn9VQf1QMcoRnzcBZVuChSWHRjHOqy97cdQVlvzhIWdIdP4cDJEL0sHiQ7xaaRTvkSKJGCcd9DGncwecSqIR1gBQBAPI7-pf_YeSNK29YmeqJLx0gbJ8L49VZT5ZMV9hByOQjohGLzKaKfLRPdeyabrjrkMFwSXEbtcvdmIOBZlgKHeSK2yoHxce4h7J5xrOVEtggUZSIpu0awhngbX-NgT0Kem1dqOBqKfg1MvrHN2RnwbeW5jMvgFhqmI9dUxgdoeo5YkzW6GvvJHlm6i4fVAWjW3HAWQw96mIXIrf6IErBXVkRFNUYh-G4LGyUoXGKL9UwVq16RWLooc',
        'User-Agent': 'MelhorEnvio-App',
      },
      body: requestBody,
    })

    console.log('Status da resposta', res.status)

    const responseText = await res.text()

    if (!res.ok) {
      console.log('Erro na API', responseText)
    }

    const data = JSON.parse(responseText)
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(data) }
  } catch (err) {
    console.log('Erro capturado', { message: err.message, stack: err.stack })
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message ?? 'Erro interno' }),
    }
  }
}
