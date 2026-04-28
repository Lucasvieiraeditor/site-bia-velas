// ═══════════════════════════════════════════════════════════════════════════
// Supabase Edge Function — MercadoPago: criar preferência de pagamento
//
// Deploy: supabase functions deploy create-preference
//
// Configure o secret: supabase secrets set MP_ACCESS_TOKEN=APP_USR-...
// Obtenha em: https://www.mercadopago.com.br/developers > Credenciais
// ═══════════════════════════════════════════════════════════════════════════

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN') ?? ''
const MP_API = 'https://api.mercadopago.com/checkout/preferences'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { items, payer, back_urls, external_reference } = body

    const preference = {
      items,
      payer,
      back_urls,
      external_reference,
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
      statement_descriptor: 'BIA VELAS',
    }

    const res = await fetch(MP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`MercadoPago error: ${err}`)
    }

    const data = await res.json()

    return new Response(
      JSON.stringify({ init_point: data.init_point, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
