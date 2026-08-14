const { createClient } = require('@supabase/supabase-js')

const MP_ACCESS_TOKEN = 'APP_USR-2258868822720925-050116-cc5053beb86ff19f470e519b05e13c47-203809776'
const SUPABASE_URL = 'https://vnmqdyzjbtouanivsadf.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_mzYk0z87Jsv4TW7gz1i6rA_1wYByL0h'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Webhook do Mercado Pago: confirma o pagamento direto na API do MP (nunca confia
// no corpo recebido) e atualiza o pedido no Supabase. Funciona mesmo que o cliente
// nunca volte pro site depois de pagar.
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const params = event.queryStringParameters || {}
    let type = params.type || params.topic
    let paymentId = params['data.id'] || params.id

    if (event.httpMethod === 'POST' && event.body) {
      try {
        const body = JSON.parse(event.body)
        type = type || body.type || body.topic
        paymentId = paymentId || body.data?.id || body.id
      } catch {
        // corpo vazio ou não-JSON — ignora
      }
    }

    console.log('[mp-webhook] Notificação recebida', { type, paymentId })

    if (type !== 'payment' || !paymentId) {
      return { statusCode: 200, body: 'ignored' }
    }

    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
    })

    if (!paymentRes.ok) {
      console.log('[mp-webhook] Erro ao consultar pagamento na API do MP', paymentRes.status)
      return { statusCode: 500, body: 'error fetching payment' }
    }

    const payment = await paymentRes.json()
    const orderId = payment.external_reference
    const status = payment.status

    console.log('[mp-webhook] Pagamento consultado', { orderId, status })

    if (orderId && status === 'approved') {
      const { error } = await supabase.from('pedidos_bia').update({ status: 'pago' }).eq('id', orderId)
      if (error) {
        console.log('[mp-webhook] Erro ao atualizar pedido', error.message)
        return { statusCode: 500, body: 'error updating order' }
      }
    }

    return { statusCode: 200, body: 'ok' }
  } catch (err) {
    console.log('[mp-webhook] Erro capturado', { message: err.message, stack: err.stack })
    return { statusCode: 500, body: 'internal error' }
  }
}
