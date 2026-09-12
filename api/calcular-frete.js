const ME_CEP_ORIGEM = '18607289'

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
}

export default async function handler(req, res) {
  setCors(res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { cepDestino, peso, quantidade } = req.body || {}

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

    const meRes = await fetch('https://melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`,
        'User-Agent': 'MelhorEnvio-App',
      },
      body: requestBody,
    })

    const responseText = await meRes.text()

    if (!meRes.ok) {
      console.log('Erro na API Melhor Envio', responseText)
    }

    const data = JSON.parse(responseText)
    return res.status(200).json(data)
  } catch (err) {
    console.log('Erro capturado', { message: err.message, stack: err.stack })
    return res.status(500).json({ error: err.message ?? 'Erro interno' })
  }
}
