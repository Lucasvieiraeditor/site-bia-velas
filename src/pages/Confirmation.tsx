import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Heart, Package, MessageCircle, ArrowRight } from 'lucide-react'
import Footer from '../components/Footer'

export default function Confirmation() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('pedido') ?? '—'
  const isDemo = searchParams.get('demo') === 'true'
  const paymentStatus = searchParams.get('status') // 'approved' | 'pending' | null

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  const isPending = paymentStatus === 'pending'

  return (
    <>
      <main className="min-h-screen bg-offwhite pt-20 pb-16 px-5 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 14, stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-rosa-claro flex items-center justify-center mx-auto mb-8"
          >
            {isPending ? (
              <Package size={40} className="text-dourado" />
            ) : (
              <CheckCircle2 size={40} className="text-rosa" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="space-y-4"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-titulo">
              {isPending ? 'Pedido recebido!' : 'Pedido confirmado!'}
            </h1>
            <p className="text-subtexto text-lg font-light max-w-md mx-auto leading-relaxed">
              {isPending
                ? 'Estamos aguardando a confirmação do seu pagamento. Você receberá um e-mail assim que for aprovado.'
                : isDemo
                ? 'Este é um pedido de demonstração. Configure o MercadoPago para ativar os pagamentos reais.'
                : 'Seu pedido foi confirmado e já está sendo preparado com todo carinho. Em breve, uma chama especial chegará até você.'}
            </p>

            {orderId !== '—' && (
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-soft text-sm text-subtexto mt-2">
                <span>Pedido</span>
                <span className="font-medium text-titulo font-mono text-xs">
                  #{orderId.slice(0, 8).toUpperCase()}
                </span>
              </div>
            )}
          </motion.div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 bg-white rounded-2xl p-7 shadow-soft text-left space-y-5"
          >
            <h2 className="font-serif text-xl font-medium text-titulo">O que acontece agora?</h2>
            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  color: 'bg-rosa-claro text-rosa',
                  title: 'Preparamos com amor',
                  desc: 'Sua vela começa a ser preparada artesanalmente em até 1 dia útil.',
                },
                {
                  icon: Package,
                  color: 'bg-bege text-dourado',
                  title: 'Embalamos com cuidado',
                  desc: 'Cada criação é embalada à mão, com carinho e atenção a cada detalhe.',
                },
                {
                  icon: MessageCircle,
                  color: 'bg-[#E8F5EE] text-[#3D8B5E]',
                  title: 'Avisamos você',
                  desc: 'Você receberá um WhatsApp com o código de rastreio assim que enviarmos.',
                },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-medium text-titulo text-sm">{title}</p>
                    <p className="text-subtexto text-sm mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/produtos" className="btn-primary px-8 py-4 text-base">
              Continuar comprando
              <ArrowRight size={16} />
            </Link>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary px-8 py-4 text-base"
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
