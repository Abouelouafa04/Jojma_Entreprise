import React from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/utils';
import { useLanguage } from '../utils/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const offers = [
    {
      title: "Conversion Multi-Format",
      description: "Notre plateforme prend en charge plus de 10 formats 3D, dont STL, GLB, GLTF, PLY, FBX, USDZ, et plus encore."
    },
    {
      title: "Visualisation AR",
      description: "Visualisez instantanément vos modèles 3D en réalité augmentée, directement depuis votre navigateur ou appareil mobile."
    },
    {
      title: "Intégration Facile",
      description: "Intégrez vos modèles AR sur votre site web ou CMS avec un simple code à copier-coller."
    },
    {
      title: "Support Expert",
      description: "Notre équipe d'experts est disponible 24/7 pour vous accompagner dans tous vos projets AR."
    }
  ];

  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const faqs = [
    {
      question: "Mes modèles 3D sont-ils sécurisés sur votre plateforme ?",
      answer: "Absolument. Nous utilisons un cryptage de bout en bout pour tous les téléchargements et stockages. Vos modèles restent votre propriété exclusive et ne sont jamais partagés sans votre consentement."
    },
    {
      question: "Puis-je convertir plusieurs formats en même temps ?",
      answer: "Oui, notre pipeline de conversion prend en charge le traitement par lots, vous permettant de convertir plusieurs fichiers simultanément pour gagner du temps."
    },
    {
      question: "Comment l'application m'aide-t-elle à visualiser mes modèles en AR ?",
      answer: "Une fois converti, nous générons un lien unique ou un QR code. En le scannant avec votre smartphone, vous pouvez placer votre modèle 3D dans votre environnement réel instantanément."
    },
    {
      question: "Puis-je intégrer vos services AR dans mon site web ?",
      answer: "Oui, nous fournissons des iFrames et des composants Web faciles à intégrer qui fonctionnent sur n'importe quel site Web, CMS ou plateforme e-commerce."
    },
    {
      question: "La plateforme est-elle gratuite ou y a-t-il des frais d'abonnement ?",
      answer: "Nous proposons une version gratuite pour les projets personnels. Pour les entreprises et les besoins de conversion élevés, nous avons des forfaits premium adaptés à votre échelle."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
          <Link to="/" className="hover:text-indigo-600 transition-colors">{t('nav.home')}</Link>
          <ChevronRight size={12} />
          <span className="text-indigo-600">{t('nav.about')}</span>
        </nav>
      </div>

      {/* Main Content Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1a3683] mb-6">{t('about.title')}</h2>
                <p className="text-slate-600 leading-relaxed mb-12 text-lg">
                  {t('about.mission_text')}
                </p>

                <h3 className="text-2xl lg:text-3xl font-extrabold text-[#1a3683] mb-8">Ce Que Nous Offrons</h3>
                
                <div className="space-y-6 mb-12">
                  {offers.map((offer, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="mt-1 shrink-0">
                        <Check className="text-indigo-600" size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 mb-1">{offer.title}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {offer.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Link 
                  to="/contact"
                  className="inline-block px-8 py-3 bg-[#1a3683] text-white font-bold rounded-lg hover:bg-indigo-900 transition-all shadow-lg shadow-indigo-100"
                >
                  Nous Contacter
                </Link>
              </motion.div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] lg:aspect-auto min-h-[500px]"
              >
                <img 
                  src="frontend/src/photos/about.png" 
                  alt="JOJMA Workspace"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a3683] py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
              Prêt à donner vie à vos modèles 3D?
            </h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Essayez notre plateforme gratuite et découvrez comment la réalité augmentée peut transformer votre façon de présenter vos produits et créations.
            </p>
            <Link
              to="/ar/experiences"
              className="inline-block px-10 py-4 bg-white text-[#1a3683] font-bold rounded-lg hover:bg-indigo-50 transition-all shadow-xl"
            >
              Commencer Gratuitement
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left Content */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block bg-[#1a3683] text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-wider mb-6">
                  Notre Approche
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1a3683] mb-6">
                  JOJMA Group Approach
                </h2>
                <p className="text-slate-600 leading-relaxed mb-10 text-base">
                  JOJMA Group croit en une approche collaborative pour la réalité augmentée. Nous travaillons étroitement avec nos clients pour comprendre leur vision et objectifs, assurant que le produit final dépasse leurs attentes. De la conception initiale au lancement final, nous priorisons la communication et la transparence pour garantir un projet fluide et réussi.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#1a3683] text-white font-bold rounded-lg hover:bg-indigo-900 transition-all shadow-lg"
                >
                  Planifier une consultation
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </div>

            {/* Right Stats */}
            <div className="lg:w-1/2 w-full">
              <div className="space-y-12">
                {[
                  { 
                    value: "150+", 
                    label: "Modèles 3D convertis", 
                    sub: "quotidiennement sur notre plateforme" 
                  },
                  { 
                    value: "300+", 
                    label: "Projets AR réalisés", 
                    sub: "pour des clients satisfaits" 
                  },
                  { 
                    value: "10+", 
                    label: "Formats 3D supportés", 
                    sub: "pour une compatibilité maximale" 
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-8"
                  >
                    <span className="text-5xl lg:text-7xl font-bold text-[#1a3683] min-w-[140px] lg:min-w-[200px]">
                      {stat.value}
                    </span>
                    <div>
                      <h4 className="text-[#1a3683] font-bold text-lg lg:text-xl mb-1">
                        {stat.label}
                      </h4>
                      <p className="text-slate-400 text-sm">
                        {stat.sub}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Grid Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Top Left: Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden h-64 lg:h-80 shadow-lg group"
            >
              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" 
                alt="Professional with laptop"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
            </motion.div>

            {/* Top Middle: 10+ Formats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#1a3683] rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white h-64 lg:h-80 shadow-xl"
            >
              <span className="text-6xl font-bold mb-2">10<span className="text-3xl">+</span></span>
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">Formats 3D supportés</p>
              <div className="flex gap-2 mt-6">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
              </div>
            </motion.div>

            {/* Top Right: Team Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden h-64 lg:h-80 shadow-lg group"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                alt="Team collaboration"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
            </motion.div>

            {/* Bottom Left: Meeting Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative rounded-3xl overflow-hidden h-64 lg:h-80 shadow-lg group"
            >
              <img 
                src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800" 
                alt="Team meeting"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
            </motion.div>

            {/* Bottom Middle: Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-[#1a3683] rounded-3xl p-10 flex flex-col justify-center text-white h-64 lg:h-80 shadow-xl"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-400/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Temps de Conversion</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-bold">-40%</span>
                  <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">plus rapide</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-indigo-400/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Taux de Satisfaction</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-4xl font-bold">98%</span>
                  <span className="text-[10px] uppercase font-bold text-green-400 tracking-wider">clients satisfaits</span>
                </div>
              </div>
            </motion.div>

            {/* Bottom Right: Lab/Tech Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="relative rounded-3xl overflow-hidden h-64 lg:h-80 shadow-lg group"
            >
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" 
                alt="Technical work"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-indigo-900/40 mix-blend-multiply"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-full"></div>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3683]">
              Trouvez des réponses à toutes vos questions ci-dessous
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-slate-100"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg font-medium text-[#1a3683] group-hover:text-indigo-600 transition-colors pr-8">
                    {faq.question}
                  </span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                    openFaq === index ? "bg-indigo-600 text-white rotate-45" : "bg-indigo-50 text-indigo-600"
                  )}>
                    <Plus size={20} />
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: openFaq === index ? "auto" : 0,
                    opacity: openFaq === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Full-width Consultation Banner */}
      <section className="bg-[#243e88] relative overflow-hidden py-20 lg:py-28">
        {/* Decorative overlapping circles matching the photo */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-white/[0.04] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-40%] right-[10%] w-[600px] h-[600px] bg-white/[0.03] rounded-full pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <div className="inline-block bg-white/10 text-white text-[11px] font-semibold px-4 py-1.5 rounded md:rounded-md mb-6 uppercase tracking-wider">
              Consultation Gratuite
            </div>
            
            <h3 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white tracking-wide">
              Optimisez Votre Expérience AR<br className="hidden md:block" /> Dès Aujourd'hui
            </h3>
            
            <p className="text-white/80 text-sm md:text-base mb-12 leading-relaxed max-w-2xl font-light">
              Ne laissez pas vos modèles 3D se fondre dans la masse. Collaborez avec 
              nous pour améliorer votre présence en ligne et vous démarquer dans 
              l'univers de la réalité augmentée. Contactez-nous dès aujourd'hui pour 
              discuter de la façon dont nos solutions AR peuvent être personnalisées 
              pour répondre aux besoins spécifiques de votre entreprise !
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#243e88] font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm group"
              >
                Réserver Une Consultation Gratuite
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors text-sm group"
              >
                Nous Contacter
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
