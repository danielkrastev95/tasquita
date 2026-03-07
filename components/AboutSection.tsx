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
}

interface AboutSectionProps {
  settings: SiteSettings | null;
}

const values = [
  {
    title: "Producto de Calidad",
    description: "Seleccionamos los mejores ingredientes de proveedores locales",
    color: "from-primary to-emerald-400",
    pattern: "quality",
  },
  {
    title: "Trae a tu Peludito",
    description: "Espacio pet-friendly donde tu mascota es bienvenida",
    color: "from-gold to-amber-400",
    pattern: "pet",
  },
  {
    title: "Ambiente Familiar",
    description: "Un espacio acogedor donde todos son bienvenidos",
    color: "from-purple-500 to-pink-400",
    pattern: "family",
  },
];

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="nosotros" className="py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with decorative elements */}
        <div className="text-center mb-20 relative">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary rounded-full blur-3xl"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl font-playfair font-bold text-gray-900 mb-4 relative"
          >
            {settings?.aboutTitle || "Nuestra Historia"}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-primary to-gold mx-auto"
          />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left: Image Grid */}
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
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 relative h-72 rounded-2xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Ambiente del restaurante"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-2xl font-playfair font-bold">Desde 2018</p>
                  <p className="text-sm">Cocinando con pasión</p>
                </div>
              </motion.div>

              {/* Small images */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative h-48 rounded-2xl overflow-hidden shadow-xl"
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
                className="relative h-48 rounded-2xl overflow-hidden shadow-xl"
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

            {/* Decorative element */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -right-8 w-24 h-24 border-4 border-gold/30 rounded-full"
            />
          </motion.div>

          {/* Right: Story Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-playfair font-bold text-primary mb-4">
                {settings?.aboutSubtitle || "Somos un bar de barrio que cocina en serio"}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {settings?.aboutParagraph1 || "Nacimos en 2018 con una idea clara: demostrar que la cocina de barrio puede ser extraordinaria sin perder su esencia. En La Tasquita de Sara, cada hamburguesa, cada croqueta y cada plato cuenta una historia."}
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                {settings?.aboutParagraph2 || "Combinamos recetas tradicionales con toques modernos, siempre respetando el producto y el sabor auténtico. Porque creemos que la buena comida no necesita etiquetas, solo pasión y dedicación."}
              </p>
            </motion.div>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg"
            >
              <p className="text-xl font-playfair italic text-gray-800">
                "{settings?.aboutQuote || "La cocina es amor hecho visible, y aquí lo sentimos en cada plato"}"
              </p>
              <p className="text-sm text-primary font-semibold mt-2">— {settings?.aboutQuoteAuthor || "El equipo de La Tasquita"}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Our Values */}
        <div className="mt-24">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-playfair font-bold text-center text-gray-900 mb-16"
          >
            Nuestros Valores
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Card */}
                <div className="relative h-full bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Gradient Header */}
                  <div className={`h-40 bg-gradient-to-br ${value.color} relative overflow-hidden`}>
                    {/* Animated shapes in background */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full"
                    />
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full"
                    />

                    {/* Icon SVG */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {value.pattern === "quality" && (
                        <svg
                          className="w-20 h-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      )}
                      {value.pattern === "pet" && (
                        <svg
                          className="w-20 h-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M4.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm17 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-7-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5 10c-2.5 0-4.5-1.5-5-3.5-.1-.4.2-.8.6-.9.4-.1.8.2.9.6.3 1.4 1.7 2.3 3.5 2.3s3.2-.9 3.5-2.3c.1-.4.5-.7.9-.6.4.1.7.5.6.9-.5 2-2.5 3.5-5 3.5z" />
                        </svg>
                      )}
                      {value.pattern === "family" && (
                        <svg
                          className="w-20 h-20 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h4 className="text-2xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Decorative element */}
                    <div className={`mt-6 h-1 w-16 bg-gradient-to-r ${value.color} rounded-full group-hover:w-full transition-all duration-500`} />
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
