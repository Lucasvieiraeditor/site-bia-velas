import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#D9CBB8]">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/">
              <img
                src="https://vnmqdyzjbtouanivsadf.supabase.co/storage/v1/object/public/imagens-bia/LOGO%20SITE.png"
                alt="By Biaggi"
                className="w-[180px] md:w-[240px] h-auto"
                style={{ objectFit: 'contain', display: 'block' }}
              />
            </Link>
            <p className="text-subtexto text-sm leading-relaxed max-w-[220px]">
              Criações artesanais feitas com cera vegetal, essências naturais e muito amor.
            </p>
            <div className="flex items-center gap-3 mt-1">
              {/* ─── Substitua pelo seu @ do Instagram ─── */}
              <a
                href="https://instagram.com/biavelasar"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-rosa-claro text-rosa hover:bg-rosa hover:text-[#FAF7F2] transition-colors duration-200"
              >
                <Instagram size={15} />
              </a>
              {/* ─── Substitua pelo seu número do WhatsApp ─── */}
              <a
                href="https://wa.me/5511992930655"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-rosa-claro text-rosa hover:bg-rosa hover:text-[#FAF7F2] transition-colors duration-200"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif text-sm font-medium text-titulo mb-4">Navegação</h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { to: '/', label: 'Início' },
                { to: '/produtos', label: 'Nossa Coleção' },
                { to: '/produtos?categoria=Presente', label: 'Presentes' },
                { to: '/produtos?categoria=Edição Limitada', label: 'Edição Limitada' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-subtexto text-sm hover:text-rosa transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-sm font-medium text-titulo mb-4">Fale conosco</h4>
            <ul className="flex flex-col gap-2.5 text-sm text-subtexto">
              <li>
                {/* ─── Substitua pelo seu email ─── */}
                <a
                  href="mailto:bia@biavelas.com.br"
                  className="hover:text-rosa transition-colors duration-200"
                >
                  bia@biavelas.com.br
                </a>
              </li>
              <li>
                {/* ─── Substitua pelo seu WhatsApp ─── */}
                <a
                  href="https://wa.me/5511992930655"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-rosa transition-colors duration-200"
                >
                  (11) 99293-0655
                </a>
              </li>
              <li className="leading-relaxed">
                Não temos horários fixos. Por ser online estamos sempre prontas para atender!
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#D9CBB8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-subtexto">
          <p>© {currentYear} Bia Velas Aromáticas. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart size={11} className="text-rosa fill-rosa" /> no Brasil
          </p>
        </div>
      </div>
    </footer>
  )
}
