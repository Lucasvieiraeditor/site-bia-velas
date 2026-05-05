import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Flame, Gift, Star, ArrowRight, Sparkles } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { featuredProducts } from '../data/products'
// ── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-offwhite">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1608181831718-c9b1d85a8c40?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="w-full h-full object-cover opacity-25"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-offwhite/60 via-offwhite/40 to-offwhite/80" />
      </div>

      {/* Decorative rose blobs */}
      <div
        aria-hidden
        className="absolute top-20 right-10 w-72 h-72 rounded-full bg-rosa/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-rosa-claro/60 blur-2xl pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-28 pb-20 w-full">
        <div className="max-w-2xl">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles size={14} className="text-dourado" />
            <span className="text-xs font-medium text-dourado tracking-[0.15em] uppercase">
              Velas artesanais brasileiras
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-titulo leading-[1.1] text-balance"
          >
            Cada chama
            <em className="block not-italic text-rosa"> conta uma história.</em>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-5 text-lg md:text-xl text-subtexto font-light leading-relaxed max-w-lg"
          >
            Velas artesanais criadas para transformar momentos em memórias. Feitas com cera vegetal,
            essências naturais e muito cuidado.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap items-center gap-4 mt-9"
          >
            <Link to="/produtos" className="btn-primary px-8 py-4 text-base">
              Ver Coleção
            </Link>
            <Link to="/produtos?categoria=Presente" className="btn-secondary px-8 py-4 text-base">
              <Gift size={16} />
              Presentear alguém
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.75 }}
            className="flex items-center gap-3 mt-10"
          >
            <div className="flex -space-x-2">
              {['bg-rosa', 'bg-bege', 'bg-dourado/50'].map((color, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-[#FAF7F2]`} />
              ))}
            </div>
            <p className="text-sm text-subtexto">
              <span className="font-medium text-titulo">+500 clientes</span> encantadas
            </p>
            <div className="flex gap-0.5 ml-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-dourado fill-dourado" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-[1px] h-10 bg-gradient-to-b from-rosa to-transparent"
        />
      </motion.div>
    </section>
  )
}

// ── Value Props ───────────────────────────────────────────────────────────────

function ValueProps() {
  const items = [
    {
      icon: Heart,
      title: 'Feito à mão com amor',
      desc: 'Cada vela é criada artesanalmente, com atenção a cada detalhe — do derretimento da cera ao acabamento final.',
    },
    {
      icon: Flame,
      title: 'Aromas que ficam na memória',
      desc: 'Essências naturais cuidadosamente selecionadas para criar fragrâncias que evocam sensações e lembranças especiais.',
    },
    {
      icon: Gift,
      title: 'Embalagem presente inclusa',
      desc: 'Toda criação vem embalada com cuidado, pronta para presentear — com opção de mensagem personalizada.',
    },
  ]

  return (
    <section className="bg-rosa-claro py-20 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="section-title">O que nos torna especiais</h2>
          <p className="section-subtitle mt-3 max-w-lg mx-auto">
            Mais do que velas — criamos momentos de autocuidado e conexão.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.12} direction="up">
              <motion.div
                whileHover={{ y: -6, boxShadow: '0 8px 40px rgba(184, 149, 106, 0.28)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="bg-[#FAF7F2] rounded-2xl p-8 text-center shadow-soft cursor-default"
              >
                <div className="w-14 h-14 rounded-full bg-rosa-claro flex items-center justify-center mx-auto mb-5">
                  <Icon size={22} className="text-rosa" />
                </div>
                <h3 className="font-serif text-lg font-medium text-titulo mb-3">{title}</h3>
                <p className="text-subtexto text-sm leading-relaxed">{desc}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Featured Products ─────────────────────────────────────────────────────────

function FeaturedProducts() {
  return (
    <section className="bg-offwhite py-20 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs font-medium text-dourado tracking-[0.15em] uppercase mb-3">
            As mais amadas
          </p>
          <h2 className="section-title">Nossas Favoritas</h2>
          <p className="section-subtitle mt-3 max-w-lg mx-auto">
            Criações que já conquistaram centenas de lares e corações brasileiros.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 0.1} />
          ))}
        </div>

        <ScrollReveal className="text-center mt-12" delay={0.2}>
          <Link to="/produtos" className="btn-secondary px-8 py-4 text-base inline-flex items-center gap-2">
            Ver toda a coleção
            <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="bg-bege py-20 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] shadow-soft-lg flex items-center justify-center">
                <img
                  src="https://vnmqdyzjbtouanivsadf.supabase.co/storage/v1/object/public/imagens-bia/LOGO%20SITE.png"
                  alt="ByBiaggi"
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Decorative card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -bottom-5 -right-5 bg-[#FAF7F2] rounded-2xl p-5 shadow-soft-lg max-w-[180px]"
              >
                <p className="font-serif text-2xl font-medium text-rosa">100%</p>
                <p className="text-xs text-subtexto mt-1 leading-snug">Cera vegetal natural & ingredientes selecionados</p>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="space-y-6">
              <div>
                <p className="text-xs font-medium text-dourado tracking-[0.15em] uppercase mb-3">
                  história da ByBiaggi
                </p>
                <h2 className="section-title leading-snug">
                  Feito com{' '}
                  <em className="not-italic text-rosa">intenção.</em>
                </h2>
              </div>

              <div className="space-y-4 text-subtexto leading-relaxed">
                <p>
                  A ByBiaggi nasceu em um momento de dor… Mas foi justamente ali que tudo começou a ganhar um novo sentido.
                </p>
                <p>
                  Em meio a um período desafiador, uma das sócias encontrou no artesanato uma forma de terapia, de reconexão e de ressignificar sentimentos. Entre aromas, texturas e silêncio, surgiu algo maior do que se imaginava: um propósito.
                </p>
                <p>
                  O que começou como um refúgio, aos poucos se transformou em visão. Nascia ali a ideia de uma marca que não venderia apenas produtos, mas experiências — um universo onde cada detalhe fosse pensado para despertar sensações, acolher e transformar momentos simples em algo especial.
                </p>
                <p>
                  Com esse sonho, convidou mais três mulheres para caminharem juntas nessa jornada. E assim, unidas, deram início à construção dessa história.
                </p>
                <p>
                  A ByBiaggi nasce da sensibilidade, da força feminina e da coragem de recomeçar. Cada vela, cada fragrância e cada criação carrega esse propósito: tocar, envolver e criar memórias através dos sentidos.
                </p>
                <p className="font-medium text-titulo italic font-serif text-lg">
                  "Hoje, mais do que uma marca, somos uma experiência. Uma pausa. Um cuidado. Um sentir."
                </p>
                <p className="text-xs text-dourado font-medium tracking-wider">
                  ByBiaggi não é apenas uma vela. É uma experiência sensorial!
                </p>
              </div>

              <Link
                to="/produtos"
                className="btn-primary inline-flex items-center gap-2 mt-2"
              >
                Conheça nossas criações
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function Testimonials() {
  const reviews = [
    {
      name: 'Mariana Costa',
      location: 'São Paulo, SP',
      stars: 5,
      text: 'Comprei a Calma da Tarde e minha casa ganhou um novo ritual. O aroma de lavanda e baunilha é exatamente o que preciso depois de um dia longo. Já pedi mais três!',
      product: 'Vela Calma da Tarde',
    },
    {
      name: 'Juliana Ferreira',
      location: 'Rio de Janeiro, RJ',
      stars: 5,
      text: 'Presenteei minha mãe com a Noite Estrelada e ela amou tanto que me pediu outra de imediato. A embalagem é um show à parte — linda, delicada e cheia de cuidado.',
      product: 'Vela Noite Estrelada',
    },
    {
      name: 'Camila Rodrigues',
      location: 'Belo Horizonte, MG',
      stars: 5,
      text: 'Cada vela da Bia é uma experiência completa. A fragrância dura muito mais do que as que encontro em lojas. Já indiquei para todas as minhas amigas.',
      product: 'Vela Ritual da Manhã',
    },
  ]

  return (
    <section className="bg-rosa-claro py-20 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs font-medium text-dourado tracking-[0.15em] uppercase mb-3">
            O que dizem nossas clientes
          </p>
          <h2 className="section-title">Amor de quem já viveu</h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map(({ name, location, stars, text, product }, i) => (
            <ScrollReveal key={name} delay={i * 0.1} direction="up">
              <div className="bg-[#FAF7F2] rounded-2xl p-7 shadow-soft h-full flex flex-col">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(stars)].map((_, j) => (
                    <Star key={j} size={14} className="text-dourado fill-dourado" />
                  ))}
                </div>
                <p className="text-subtexto text-sm leading-relaxed flex-1">"{text}"</p>
                <div className="mt-5 pt-4 border-t border-[#D9CBB8]">
                  <p className="font-medium text-titulo text-sm">{name}</p>
                  <p className="text-subtexto text-xs mt-0.5">{location}</p>
                  <p className="text-rosa text-xs mt-1 font-medium">{product}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="bg-rosa py-24 px-5 md:px-8 text-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="absolute top-0 left-0 w-72 h-72 rounded-full bg-[#FAF7F2]/10 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#FAF7F2]/10 blur-3xl pointer-events-none translate-x-1/3 translate-y-1/3" />

      <ScrollReveal direction="up" className="relative">
        <p className="text-[#FAF7F2]/80 text-sm font-medium tracking-[0.15em] uppercase mb-5">
          Para você ou para quem você ama
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-[#FAF7F2] leading-snug text-balance max-w-3xl mx-auto">
          O presente perfeito para quem você ama — inclusive você.
        </h2>
        <p className="text-[#FAF7F2]/80 text-lg mt-5 max-w-lg mx-auto font-light">
          Cada criação vem embalada com delicadeza, pronta para ser entregue com amor.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link to="/produtos" className="btn-white px-8 py-4 text-base">
            Escolher minha vela
          </Link>
          <Link
            to="/produtos?categoria=Presente"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#FAF7F2]/60 text-[#FAF7F2] text-base font-medium hover:bg-[#FAF7F2]/10 transition-all duration-300"
          >
            <Gift size={16} />
            Ver presentes
          </Link>
        </div>
      </ScrollReveal>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Hero />
      <ValueProps />
      <FeaturedProducts />
      <About />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
