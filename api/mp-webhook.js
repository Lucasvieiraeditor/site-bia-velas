import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

// Webhook do Mercado Pago: confirma o pagamento direto na API do MP (nunca confia
// no corpo recebido) e atualiza o pedido no Supabase. Funciona mesmo que o cliente
// nunca volte pro site depois de pagar.
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed')
  }

  try {
    const query = req.query || {}
    let type = query.type || query.topic
    let paymentId = query['data.id'] || query.id

    if (req.method === 'POST' && req.body) {
      const body = req.body
      type = type || body.type || body.topic
      paymentId = paymentId || body.data?.id || body.id
    }

    console.log('[mp-webhook] Notificação recebida', { type, paymentId })

    if (type !== 'payment' || !paymentId) {
      return res.status(200).send('ignored')
    }

    const paymentRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` },
    })

    if (!paymentRes.ok) {
      console.log('[mp-webhook] Erro ao consultar pagamento na API do MP', paymentRes.status)
      return res.status(500).send('error fetching payment')
    }

    const payment = await paymentRes.json()
    const orderId = payment.external_reference
    const status = payment.status

    console.log('[mp-webhook] Pagamento consultado', { orderId, status })

    if (orderId && status === 'approved') {
      const { error } = await supabase.from('pedidos_bia').update({ status: 'pago' }).eq('id', orderId)
      if (error) {
        console.log('[mp-webhook] Erro ao atualizar pedido', error.message)
        return res.status(500).send('error updating order')
      }
    }

    return res.status(200).send('ok')
  } catch (err) {
    console.log('[mp-webhook] Erro capturado', { message: err.message, stack: err.stack })
    return res.status(500).send('internal error')
  }
}
