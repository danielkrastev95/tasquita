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
    icon: "quality",
  },
  {
    title: "Trae a tu Peludito",
    description: "Espacio pet-friendly donde tu mascota es bienvenida",
    icon: "pet",
  },
  {
    title: "Ambiente Familiar",
    description: "Un espacio acogedor donde todos son bienvenidos",
    icon: "family",
  },
];

export default function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section id="nosotros" className="py-20 relative overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-primary/5" />

      {/* Blur orbs for depth */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl font-playfair font-bold text-gray-900 mb-4"
          >
            {settings?.aboutTitle || "Nuestra Historia"}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 mx-auto rounded-full"
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
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 relative h-72 rounded-3xl overflow-hidden shadow-2xl"
              >
                <Image
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80"
                  alt="Ambiente del restaurante"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-3xl font-playfair font-bold">Desde 2018</p>
                  <p className="text-sm opacity-90">Cocinando con pasión</p>
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
          </motion.div>

          {/* Right: Story Text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
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

            {/* Quote with Glass Morphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="relative mt-8 rounded-2xl overflow-hidden"
            >
              {/* Glass background */}
              <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />

              <div className="relative p-6 border border-white/20">
                <div className="flex items-start gap-3">
                  <svg className="w-8 h-8 text-primary/40 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <div>
                    <p className="text-xl font-playfair italic text-gray-800 leading-relaxed">
                      {settings?.aboutQuote || "La cocina es amor hecho visible, y aquí lo sentimos en cada plato"}
                    </p>
                    <p className="text-sm text-primary font-semibold mt-3">
                      — {settings?.aboutQuoteAuthor || "El equipo de La Tasquita"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Our Values with Creative Glass Morphism Cards */}
        <div className="mt-32">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-playfair font-bold text-center text-gray-900 mb-20"
          >
            Nuestros Valores
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Glass Morphism Card */}
                <div className="relative h-full rounded-3xl overflow-hidden">
                  {/* Layered glass backgrounds */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/50 to-white/30 backdrop-blur-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold/5" />

                  {/* Border with gradient */}
                  <div className="absolute inset-0 rounded-3xl border border-white/20" />

                  {/* Animated gradient on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: 'radial-gradient(circle at 50% 0%, rgba(83, 166, 153, 0.1) 0%, transparent 60%)',
                    }}
                  />

                  {/* Content */}
                  <div className="relative p-8 h-full flex flex-col">
                    {/* Icon with floating animation */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="mb-6"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-xl flex items-center justify-center border border-primary/10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        {value.icon === "quality" && (
                          <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {value.icon === "pet" && (
                          <svg
                            className="w-8 h-8 text-primary"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4.5 12a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm17 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-7-5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-5 10c-2.5 0-4.5-1.5-5-3.5-.1-.4.2-.8.6-.9.4-.1.8.2.9.6.3 1.4 1.7 2.3 3.5 2.3s3.2-.9 3.5-2.3c.1-.4.5-.7.9-.6.4.1.7.5.6.9-.5 2-2.5 3.5-5 3.5z" />
                          </svg>
                        )}
                        {value.icon === "family" && (
                          <svg
                            className="w-8 h-8 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </motion.div>

                    {/* Text content */}
                    <h4 className="text-2xl font-playfair font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300">
                      {value.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {value.description}
                    </p>

                    {/* Subtle accent line */}
                    <div className="mt-6 h-0.5 w-12 bg-gradient-to-r from-primary/60 to-transparent rounded-full group-hover:w-24 transition-all duration-500" />
                  </div>

                  {/* Shimmer effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{
                      backgroundPosition: ["200% 0%", "-200% 0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      backgroundSize: '200% 100%',
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
