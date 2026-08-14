import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Gift, Star, ArrowRight, ChevronDown } from 'lucide-react'
import ScrollReveal from '../components/ScrollReveal'
import ProductCard from '../components/ProductCard'
import Footer from '../components/Footer'
import { featuredProducts } from '../data/products'
import { SUBCATEGORIAS_COLECAO } from '../lib/subcategorias'

// ── Section heading — editorial, respira como revista de luxo ─────────────────

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="text-center">
      {eyebrow && (
        <p className="text-xs font-medium text-subtexto tracking-widest uppercase mb-5">
          {eyebrow}
        </p>
      )}
      <h2 className="section-title">{title}</h2>
      <div className="w-10 h-px bg-dourado mx-auto mt-5" />
      {subtitle && (
        <p className="section-subtitle mt-8 max-w-md mx-auto">{subtitle}</p>
      )}
    </div>
  )
}

// ── Hero — 100vh, imagem imersiva, texto centralizado ─────────────────────────

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Full-bleed background — imagem respira mais com overlay mais sutil */}
      <div className="absolute inset-0">
        <img
          src="https://vnmqdyzjbtouanivsadf.supabase.co/storage/v1/object/public/imagens-bia/Hero.jpeg"
          alt="Velas aromáticas artesanais ByBiaggi"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-titulo/30 via-titulo/58 to-titulo/75" />
      </div>

      {/* Conteúdo centralizado horizontal e verticalmente */}
      <div className="relative text-center px-6 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="text-white/80 text-xs tracking-[0.3em] uppercase mb-8"
        >
          Velas artesanais brasileiras
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-5xl md:text-7xl font-medium text-white leading-[1.07] text-balance"
        >
          Cada chama
          <em className="block not-italic text-rosa"> conta uma história.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-7 text-white/90 text-base md:text-lg font-light leading-relaxed max-w-sm mx-auto"
        >
          Criações artesanais com cera vegetal, essências naturais e muito cuidado.
        </motion.p>

        {/* CTAs — simples, elegantes, sem pulse ou glow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-11 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-9 py-3.5 rounded-full bg-[#FAF7F2] text-titulo text-sm font-medium hover:bg-rosa-claro transition-colors duration-300"
          >
            Ver Coleção
          </Link>
        </motion.div>

        {/* Social proof — discreto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex items-center justify-center gap-3 mt-12"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="text-dourado fill-dourado" />
            ))}
          </div>
          <p className="text-[#FAF7F2]/70 text-xs">
            <span className="text-[#FAF7F2]/90 font-medium">+500 clientes</span> encantadas
          </p>
        </motion.div>
      </div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-[#FAF7F2]/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}

// ── Category Shortcuts — faixa editorial numerada ────────────────────────────

function CategoryShortcuts() {
  const [colecaoOpen, setColecaoOpen] = useState(false)

  const shortcuts = [
    { num: '02', label: 'Lembrancinhas', to: '/produtos?categoria=Lembrancinhas' },
    { num: '03', label: 'Kits completos', to: '/produtos?categoria=Kit' },
    { num: '04', label: 'Presentes corporativos', to: '/produtos?categoria=Presente' },
  ]

  return (
    <section className="bg-[#FAF7F2] border-b border-[#D9CBB8]">
      <div className="max-w-6xl mx-auto divide-y divide-[#D9CBB8] md:flex md:divide-y-0 md:divide-x md:divide-[#D9CBB8]">
        <ScrollReveal delay={0} direction="none" className="md:flex-1">
          <button
            type="button"
            onClick={() => setColecaoOpen((v) => !v)}
            aria-expanded={colecaoOpen}
            className="group flex items-center justify-between px-6 py-5 md:flex-col md:items-center md:justify-center md:py-9 md:px-4 hover:bg-rosa-claro transition-colors duration-300 w-full text-left"
          >
            <div className="flex items-center gap-3 md:flex-col md:gap-2 md:text-center">
              <span className="font-serif text-[10px] text-subtexto/40 tracking-widest">01</span>
              <span className="text-[13px] font-medium text-titulo tracking-[0.04em] group-hover:text-rosa transition-colors duration-300">
                Coleção completa
              </span>
            </div>
            <ChevronDown
              size={13}
              className={`text-subtexto/30 group-hover:text-rosa transition-transform duration-300 md:mt-1 ${colecaoOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </ScrollReveal>
        {shortcuts.map(({ num, label, to }, i) => (
          <ScrollReveal key={num} delay={(i + 1) * 0.06} direction="none" className="md:flex-1">
            <Link
              to={to}
              className="group flex items-center justify-between px-6 py-5 md:flex-col md:items-center md:justify-center md:py-9 md:px-4 hover:bg-rosa-claro transition-colors duration-300 w-full"
            >
              <div className="flex items-center gap-3 md:flex-col md:gap-2 md:text-center">
                <span className="font-serif text-[10px] text-subtexto/40 tracking-widest">{num}</span>
                <span className="text-[13px] font-medium text-titulo tracking-[0.04em] group-hover:text-rosa transition-colors duration-300">
                  {label}
                </span>
              </div>
              <ArrowRight size={13} className="text-subtexto/30 group-hover:text-rosa group-hover:translate-x-0.5 transition-all duration-300 md:hidden" />
            </Link>
          </ScrollReveal>
        ))}
      </div>

      <AnimatePresence initial={false}>
        {colecaoOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-t border-[#D9CBB8] bg-offwhite"
          >
            <div className="max-w-6xl mx-auto px-6 md:px-8 py-6 flex flex-wrap gap-3">
              {SUBCATEGORIAS_COLECAO.map((sub) => (
                <Link
                  key={sub}
                  to={`/produtos?categoria=Coleção&subcategoria=${encodeURIComponent(sub)}`}
                  className="px-4 py-2 rounded-full text-[12px] font-medium text-titulo bg-[#FAF7F2] border border-[#D9CBB8] hover:border-rosa hover:text-rosa transition-colors duration-200"
                >
                  {sub}
                </Link>
              ))}
              <Link
                to="/produtos?categoria=Coleção"
                className="px-4 py-2 rounded-full text-[12px] font-medium text-subtexto hover:text-rosa transition-colors duration-200"
              >
                Ver toda a coleção →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── Brand Statement — seção editorial entre hero e produtos ───────────────────

function BrandStatement() {
  return (
    <section className="bg-[#FAF7F2] py-24 md:py-32 px-5 md:px-8 relative overflow-hidden">
      {/* Decorative background serif — quase invisível, marca presença da identidade */}
      <span
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-serif font-medium select-none pointer-events-none hidden lg:block"
        style={{ fontSize: 'clamp(10rem, 18vw, 22rem)', lineHeight: 1, color: 'rgba(42,33,24,0.025)' }}
        aria-hidden
      >
        Luz
      </span>
      <div className="max-w-2xl mx-auto text-center relative">
        <ScrollReveal>
          {/* Linha decorativa antes do título */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-dourado/40" />
            <div className="w-1 h-1 rounded-full bg-rosa" />
            <div className="h-px w-12 bg-dourado/40" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-titulo leading-snug text-balance">
            Aromas que transformam momentos simples em memórias inesquecíveis.
          </h2>
          <p className="text-subtexto text-base md:text-lg font-light leading-relaxed mt-8 max-w-lg mx-auto">
            Cada criação nasce da intenção de envolver, acolher e despertar sensações, feita à mão, com cera vegetal e essências naturais selecionadas.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── Value Props ───────────────────────────────────────────────────────────────

function ValueProps() {
  const items = [
    {
      title: 'Aromas que ficam na memória',
      desc: 'A ByBiaggi não vende apenas velas, entrega experiências. Cada aroma é pensado para despertar memórias, acolher, acalmar e transformar a casa em um refúgio cheio de identidade e emoção.',
    },
    {
      title: 'Feito à mão com amor',
      desc: 'Produção artesanal com essência de luxo. As peças são feitas com cera vegetal, fragrâncias sofisticadas e acabamento delicado, unindo cuidado artesanal com estética elegante e sensorial.',
    },
    {
      title: 'Luz, memórias e recomeços',
      desc: 'Existe alma e verdade por trás da marca. A ByBiaggi nasceu de uma história real, de recomeço, sensibilidade e amor pelos detalhes, e isso faz cada produto carregar sentimento, propósito e conexão.',
    },
  ]

  return (
    <section className="bg-rosa-claro py-28 md:py-36 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionHeading
            title="O que nos torna especiais"
            subtitle="Mais do que velas, criamos momentos de autocuidado e conexão."
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map(({ title, desc }, i) => (
            <ScrollReveal key={title} delay={i * 0.12} direction="up">
              <div className="bg-[#FAF7F2] rounded-2xl p-10 text-center shadow-soft border-t-[3px] border-rosa/25">
                <div className="w-12 h-12 rounded-full bg-rosa-claro flex items-center justify-center mx-auto mb-6">
                  <Heart size={20} className="text-rosa" />
                </div>
                <h3 className="font-serif text-lg font-medium text-titulo mb-4">{title}</h3>
                <p className="text-subtexto text-sm leading-7">{desc}</p>
              </div>
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
    <section className="bg-offwhite py-28 md:py-36 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionHeading
            eyebrow="As mais amadas"
            title="Nossas Favoritas"
            subtitle="Criações que já conquistaram centenas de lares e corações brasileiros."
          />
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} delay={i * 0.1} />
          ))}
        </div>

        <ScrollReveal className="text-center mt-16" delay={0.2}>
          <Link
            to="/produtos"
            className="btn-secondary px-10 py-4 text-sm inline-flex items-center gap-2"
          >
            Ver toda a coleção
            <ArrowRight size={15} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}

// ── About ─────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section className="bg-bege py-28 md:py-36 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
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
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                className="absolute -bottom-5 -right-5 bg-[#FAF7F2] rounded-2xl p-5 shadow-soft-lg max-w-[180px]"
              >
                <p className="font-serif text-2xl font-medium text-rosa">100%</p>
                <p className="text-xs text-subtexto mt-1 leading-snug">
                  Cera vegetal natural &amp; ingredientes selecionados
                </p>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Text */}
          <ScrollReveal direction="right" delay={0.15}>
            <div className="space-y-7">
              <div>
                <p className="text-xs font-medium text-subtexto tracking-widest uppercase mb-5">
                  história da ByBiaggi
                </p>
                <h2 className="section-title leading-snug">
                  Feito com{' '}
                  <em className="not-italic text-rosa">intenção.</em>
                </h2>
                <div className="w-10 h-px bg-dourado mt-5" />
              </div>

              <div className="space-y-4 text-subtexto leading-relaxed text-[0.9375rem]">
                <p>
                  A ByBiaggi nasceu do desejo de transformar ambientes em experiências. Mais do que velas aromáticas, criamos sensações, memórias e momentos de pausa em meio à correria da vida. Cada detalhe carrega propósito: das fragrâncias cuidadosamente escolhidas ao acabamento artesanal de cada peça. Trabalhamos com matérias-primas de alta qualidade, buscando unir sofisticação, aconchego e identidade olfativa em produtos que perfumam a casa e acolhem a alma.
                </p>
                <p>
                  A marca nasceu em um momento de recomeço. O que começou como um refúgio afetivo e uma forma de transformar sentimentos em criação, hoje se tornou uma empresa construída com amor, sensibilidade e verdade.
                </p>
                <p>
                  Na ByBiaggi, acreditamos que o perfume tem o poder de marcar histórias, despertar emoções e transformar uma casa em lar. Por isso, cada vela, difusor e aroma é desenvolvido para proporcionar experiências únicas, elegantes e inesquecíveis.
                </p>
                <p className="font-serif text-lg font-medium text-titulo italic leading-snug">
                  "ByBiaggi, essência em cada chama."
                </p>
              </div>

              <Link to="/produtos" className="btn-primary inline-flex items-center gap-2">
                Conheça nossas criações
                <ArrowRight size={14} />
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
      text: 'Presenteei minha mãe com a Noite Estrelada e ela amou tanto que me pediu outra de imediato. A embalagem é um show à parte, linda, delicada e cheia de cuidado.',
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
    <section className="bg-rosa-claro py-28 md:py-36 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="mb-16">
          <SectionHeading
            eyebrow="O que dizem nossas clientes"
            title="Amor de quem já viveu"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(({ name, location, stars, text, product }, i) => (
            <ScrollReveal key={name} delay={i * 0.1} direction="up">
              <div className="bg-[#FAF7F2] rounded-2xl p-8 shadow-soft h-full flex flex-col relative overflow-hidden">
                {/* Aspas decorativas em serif — micro-detalhe editorial */}
                <span
                  className="absolute -top-3 -left-1 font-serif font-medium select-none pointer-events-none leading-none"
                  style={{ fontSize: '6rem', color: 'rgba(184,149,106,0.10)' }}
                  aria-hidden
                >
                  "
                </span>
                <div className="flex gap-1 mb-5 relative">
                  {[...Array(stars)].map((_, j) => (
                    <Star key={j} size={13} className="text-dourado fill-dourado" />
                  ))}
                </div>
                <p className="text-subtexto text-sm leading-relaxed flex-1 relative">"{text}"</p>
                <div className="mt-6 pt-5 border-t border-[#D9CBB8] relative">
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
    <section className="bg-rosa py-32 md:py-44 px-5 md:px-8 text-center relative overflow-hidden">
      <ScrollReveal direction="up" className="relative">
        <p className="text-[#FAF7F2]/80 text-xs font-medium tracking-widest uppercase mb-7">
          Para você ou para quem você ama
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] font-medium text-[#FAF7F2] leading-snug text-balance max-w-2xl mx-auto">
          O presente perfeito para quem você ama, inclusive você.
        </h2>
        <div className="w-10 h-px bg-[#FAF7F2]/35 mx-auto mt-7" />
        <p className="text-[#FAF7F2]/80 text-base mt-8 max-w-md mx-auto font-light">
          Cada criação vem embalada com delicadeza, pronta para ser entregue com amor.
        </p>
        <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/produtos"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#FAF7F2] text-rosa text-sm font-medium hover:bg-rosa-claro transition-colors duration-300"
          >
            Escolher minha vela
          </Link>
          <Link
            to="/produtos?categoria=Presente"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full border border-[#FAF7F2]/40 text-[#FAF7F2] text-sm font-medium hover:bg-[#FAF7F2]/10 transition-all duration-300"
          >
            <Gift size={15} />
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
      <CategoryShortcuts />
      <BrandStatement />
      <ValueProps />
      <FeaturedProducts />
      <About />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
