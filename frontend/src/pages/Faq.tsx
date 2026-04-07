import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "Est-ce que mes données financières sont sécurisées ?",
      answer: "Absolument. Nous utilisons des protocoles de cryptage de pointe (SSL/TLS) pour sécuriser toutes vos transactions. Vos informations de paiement ne sont jamais stockées sur nos serveurs et sont traitées par des prestataires certifiés PCI-DSS."
    },
    {
      question: "Quels formats de fichiers 3D sont pris en charge ?",
      answer: "Notre convertisseur prend en charge la majorité des formats standards de l'industrie, incluant GLB, GLTF, USDZ, OBJ, FBX, STL et DAE. Nous mettons régulièrement à jour nos systèmes pour intégrer de nouveaux formats."
    },
    {
      question: "Puis-je convertir plusieurs formats en même temps ?",
      answer: "Oui, notre plateforme permet un traitement par lot (batch processing) dans le cadre de nos abonnements Premium. Vous pouvez uploader plusieurs fichiers simultanément et nous les convertissons en arrière-plan."
    },
    {
      question: "Comment puis-je visualiser mes modèles en réalité augmentée ?",
      answer: "Une fois votre modèle converti, nous générons automatiquement un QR code et un lien web. Vos clients n'ont qu'à scanner le code avec leur smartphone (iOS ou Android) pour voir le modèle en AR sans aucune application à installer."
    },
    {
      question: "Puis-je intégrer les services AR dans mon site web ?",
      answer: "Oui, nous fournissons un snippet d'intégration iframe simple que vous pouvez insérer dans votre site e-commerce, WordPress ou application personnalisée pour y afficher directement notre visionneuse 3D/AR."
    },
    {
      question: "La plateforme est-elle gratuite ou y a-t-il des frais d'abonnement ?",
      answer: "Nous proposons un convertisseur de base gratuit pour tester nos services. Pour les professionnels nécessitant un volume plus important, des conversions en lot ou des fonctionnalités AR sur-mesure, nous offrons différents plans d'abonnement."
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-[#243c82] py-20 text-center">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            FAQs
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-white/80 text-sm font-medium"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white">FAQs</span>
          </motion.div>
        </div>
      </section>

      {/* FAQs List Section */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-[#1a3683]"
            >
              General FAQs
            </motion.h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 mb-20">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex items-center justify-between w-full p-5 lg:p-6 text-left transition-colors hover:bg-slate-50"
                >
                  <span className="font-semibold text-[#1a3683] text-[15px] pr-4">{faq.question}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[#1a3683] shrink-0"
                  >
                    <ChevronDown size={20} strokeWidth={2.5} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 lg:px-6 pb-6 text-slate-600 text-sm leading-relaxed"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="text-center max-w-2xl mx-auto">
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl lg:text-2xl font-bold text-[#1a3683] mb-4"
            >
              Vous n'avez pas trouvé la réponse à votre question ?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-sm mb-8"
            >
              N'hésitez pas à nous contacter directement pour obtenir plus d'informations
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/contact" className="inline-block px-8 py-3 bg-[#1e347e] text-white rounded-lg font-medium text-sm hover:bg-[#15255e] transition-colors shadow-md">
                Contactez-nous
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
