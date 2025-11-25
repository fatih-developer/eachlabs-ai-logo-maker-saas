"use client"

import { useRef } from "react"

const showcaseLogos = [
  { id: 1, name: "Finance App", colors: ["#3b82f6", "#1d4ed8"], icon: "F" },
  { id: 2, name: "Health Tracker", colors: ["#10b981", "#047857"], icon: "+" },
  { id: 3, name: "Music Player", colors: ["#f43f5e", "#be123c"], icon: "►" },
  { id: 4, name: "Task Manager", colors: ["#f59e0b", "#b45309"], icon: "✓" },
  { id: 5, name: "Social Network", colors: ["#8b5cf6", "#6d28d9"], icon: "@" },
  { id: 6, name: "E-commerce", colors: ["#14b8a6", "#0f766e"], icon: "$" },
  { id: 7, name: "Weather App", colors: ["#0ea5e9", "#0369a1"], icon: "☀" },
  { id: 8, name: "Fitness Coach", colors: ["#ef4444", "#b91c1c"], icon: "♥" },
]

export function ShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="showcase" className="py-24 md:py-32 bg-background relative overflow-hidden [perspective:1000px]">

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium mb-6">
            Showcase
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Generated <span className="text-primary">Masterpieces</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            High-fidelity 3D exports ready for your production environment.
          </p>
        </div>

        {/* 3D Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 [perspective:1000px]"
        >
          {showcaseLogos.map((logo) => (
            <div
              key={logo.id}
              className="group relative aspect-square"
            >
              {/* 3D Card Container */}
              <div className="w-full h-full relative transition-all duration-500 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(12deg)_rotateX(12deg)] group-hover:scale-105">

                {/* Glass Layer */}
                <div
                  className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
                  style={{
                    boxShadow: `0 25px 50px -12px ${logo.colors[0]}40`,
                  }}
                >
                  {/* Inner Gradient Blob */}
                  <div
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-40 transition-transform duration-700 group-hover:rotate-45"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${logo.colors[0]}, transparent, ${logo.colors[1]}, transparent)`
                    }}
                  />

                  {/* The Logo Object (Simulated 3D) */}
                  <div className="absolute inset-0 flex items-center justify-center [transform:translateZ(20px)]">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg transition-transform duration-500 group-hover:[transform:translateZ(10px)] group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1]})`,
                        textShadow: "0 2px 10px rgba(0,0,0,0.3)"
                      }}
                    >
                      {logo.icon}
                    </div>
                  </div>

                  {/* Shine/Reflection effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 [transform:translateZ(30px)]" />
                </div>
              </div>

              {/* Label on hover */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-8 transition-all duration-300">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {logo.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-2">
            Ready to create your own?
          </p>
          <a
            href="/create"
            className="text-primary font-medium hover:underline"
          >
            Start generating logos →
          </a>
        </div>
      </div>
    </section>
  )
}
