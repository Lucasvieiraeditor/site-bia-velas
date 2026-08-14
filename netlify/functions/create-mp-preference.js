const MP_ACCESS_TOKEN = 'APP_USR-2258868822720925-050116-cc5053beb86ff19f470e519b05e13c47-203809776'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

// Cria a preferência de pagamento no Mercado Pago do lado do servidor, pra o
// token de acesso nunca ficar exposto no JS público do site.
exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  try {
    const preference = JSON.parse(event.body)

    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    })

    const data = await res.json()
    return { statusCode: res.status, headers: CORS_HEADERS, body: JSON.stringify(data) }
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message ?? 'Erro interno' }),
    }
  }
}
