import { useState } from 'react'
import { Loader2, Truck } from 'lucide-react'
import type { Product } from '../types'

interface ShippingOption {
  id: number
  name: string
  price: number
  delivery_time: number
}

function formatCEP(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

export default function ShippingEstimator({ product }: { product: Product }) {
  const [cep, setCep] = useState('')
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cepRaw = cep.replace(/\D/g, '')
  const canCalculate = cepRaw.length === 8

  const calculate = async () => {
    if (!canCalculate) return
    setLoading(true)
    setError(null)
    setOptions([])
    try {
      const res = await fetch('/api/calcular-frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cepDestino: cepRaw,
          peso: product.peso ?? 100,
          quantidade: 1,
        }),
      })
      if (!res.ok) throw new Error('API error')
      const data: Record<string, unknown>[] = await res.json()
      const valid: ShippingOption[] = data
        .filter((s) => !s.error && s.price != null && (s.company as { name: string } | undefined)?.name === 'Correios')
        .map((s) => ({
          id: s.id as number,
          name: s.name as string,
          price: parseFloat(s.price as string),
          delivery_time: s.delivery_time as number,
        }))
      if (valid.length === 0) throw new Error('no options')
      setOptions(valid)
    } catch {
      setError('Não foi possível calcular o frete agora. Tente novamente ou fale no WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-[#D9CBB8] rounded-2xl p-5 bg-[#FAF7F2]">
      <div className="flex items-center gap-2 mb-3">
        <Truck size={16} className="text-subtexto" />
        <h3 className="font-serif text-base font-medium text-titulo">Calcular frete</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => { setCep(formatCEP(e.target.value)); setOptions([]); setError(null) }}
          placeholder="00000-000"
          maxLength={9}
          className="input-field flex-1"
        />
        <button
          type="button"
          onClick={calculate}
          disabled={!canCalculate || loading}
          className="btn-primary px-5 disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Calcular'}
        </button>
      </div>

      {options.length > 0 && (
        <div className="mt-4 space-y-2">
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center justify-between gap-2 text-sm px-3 py-2 rounded-xl bg-offwhite">
              <span className="text-titulo font-medium">{opt.name}</span>
              <span className="text-subtexto text-xs shrink-0">até {opt.delivery_time} dias úteis</span>
              <span className="text-dourado font-medium shrink-0">
                R$ {opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
    </div>
  )
}
