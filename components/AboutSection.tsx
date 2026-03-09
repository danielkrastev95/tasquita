"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface SiteSettings {
  aboutTitle: string;
  aboutSubtitle: string;
  aboutParagraph1: string;
  aboutParagraph2: string;
  aboutQuote: string;
  aboutQuoteAuthor: string;
  value1Title: string;
  value1Description: string;
  value2Title: string;
  value2Description: string;
  value3Title: string;
  value3Description: string;
}

interface AboutSectionProps {
  settings: SiteSettings | null;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="nosotros" className="py-12 relative overflow-hidden bg-white">
      {/* Geometric Background - Asymmetric */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/3 bg-primary/10" />
        <div className="absolute bottom-0 left-0 w-2/3 h-1/2 bg-gold/5" />
        <div className="absolute top-1/3 left-1/4 w-32 h-32 border-8 border-primary/20 rotate-45" />
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 border-8 border-gold/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Title - Skewed */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <motion.h2
            animate={{
              y: [0, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl sm:text-8xl font-black text-gray-900 uppercase tracking-tighter leading-none"
            style={{
              textShadow: "12px 12px 0px rgba(83, 166, 153, 0.2)",
            }}
          >
            <span className="text-primary">{settings?.aboutTitle || "Nuestra Historia"}</span>
          </motion.h2>
        </motion.div>

        {/* Content and Images Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left - Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Large image */}
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 relative h-64 border-4 border-black overflow-hidden shadow-xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Ambiente del restaurante"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 border-t-4 border-primary">
                  <p className="text-2xl font-black text-white uppercase tracking-tight">Desde 2025</p>
                  <p className="text-xs text-gold font-bold uppercase tracking-wider">Cocinando con pasión</p>
                </div>
              </motion.div>

              {/* Small images */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative h-40 border-4 border-black overflow-hidden shadow-lg"
              >
                <Image
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                  alt="Comida deliciosa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative h-40 border-4 border-black overflow-hidden shadow-lg"
              >
                <Image
                  src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80"
                  alt="Ingredientes frescos"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Subtitle Box */}
            <div className="bg-primary border-4 border-black p-5 shadow-lg">
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight">
                {settings?.aboutSubtitle || "Somos un bar de barrio que cocina en serio"}
              </h3>
            </div>

            {/* Text */}
            <div className="space-y-6 text-lg text-gray-700">
              <p className="leading-relaxed">
                {settings?.aboutParagraph1 || "Nacimos en 2018 con una idea clara: demostrar que la cocina de barrio puede ser extraordinaria sin perder su esencia. En La Tasquita de Sara, cada hamburguesa, cada croqueta y cada plato cuenta una historia."}
              </p>
              <p className="leading-relaxed">
                {settings?.aboutParagraph2 || "Combinamos recetas tradicionales con toques modernos, siempre respetando el producto y el sabor auténtico. Porque creemos que la buena comida no necesita etiquetas, solo pasión y dedicación."}
              </p>
            </div>

            {/* Quote */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative bg-white border-l-4 border-gold p-6 shadow-lg"
            >
              <svg className="w-12 h-12 text-gold/20 absolute -top-3 -left-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl font-bold italic text-gray-900 mb-3 relative z-10">
                "{settings?.aboutQuote || "La cocina es amor hecho visible, y aquí lo sentimos en cada plato"}"
              </p>
              <p className="text-sm text-primary font-black uppercase tracking-wider">
                — {settings?.aboutQuoteAuthor || "El equipo de La Tasquita"}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Values - Horizontal Grid */}
        <div>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-7xl font-black text-center text-gray-900 uppercase tracking-tighter mb-12"
            style={{
              textShadow: "6px 6px 0px rgba(199, 175, 101, 0.2)",
            }}
          >
            Nuestros Valores
          </motion.h3>

          {/* Horizontal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                title: settings?.value1Title || "Producto de Calidad",
                description: settings?.value1Description || "Seleccionamos los mejores ingredientes de proveedores locales",
                icon: "quality",
              },
              {
                title: settings?.value2Title || "Trae a tu Peludito",
                description: settings?.value2Description || "Espacio pet-friendly donde tu mascota es bienvenida",
                icon: "pet",
              },
              {
                title: settings?.value3Title || "Ambiente Familiar",
                description: settings?.value3Description || "Un espacio acogedor donde todos son bienvenidos",
                icon: "family",
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative h-full bg-white border-4 border-black p-6 shadow-lg"
                >
                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-primary" />

                  {/* Icon */}
                  <div className="mb-4 relative">
                    <div className="w-16 h-16 bg-gold border-4 border-black flex items-center justify-center">
                      {value.icon === "quality" && (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {value.icon === "pet" && (
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 512 512">
                          <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z"/>
                        </svg>
                      )}
                      {value.icon === "family" && (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <h4 className="text-2xl font-black text-gray-900 mb-3 uppercase tracking-tight">
                    {value.title}
                  </h4>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {value.description}
                  </p>

                  {/* Bottom accent line */}
                  <div className="mt-4 h-1 w-12 bg-primary group-hover:w-full transition-all duration-500" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
