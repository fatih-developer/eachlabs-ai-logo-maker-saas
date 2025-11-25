"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Extended sample logos with more variety - monochrome style
const sampleLogos = [
  { id: 1, name: "TechFlow", icon: "T" },
  { id: 2, name: "Spark", icon: "S" },
  { id: 3, name: "Nexus", icon: "N" },
  { id: 4, name: "Pulse", icon: "P" },
  { id: 5, name: "Nova", icon: "✦" },
  { id: 6, name: "Apex", icon: "A" },
  { id: 7, name: "Drift", icon: "D" },
  { id: 8, name: "Bloom", icon: "B" },
  { id: 9, name: "Orbit", icon: "O" },
  { id: 10, name: "Flux", icon: "F" },
  { id: 11, name: "Zenith", icon: "Z" },
  { id: 12, name: "Prism", icon: "◇" },
  { id: 13, name: "Wave", icon: "W" },
  { id: 14, name: "Helix", icon: "H" },
  { id: 15, name: "Echo", icon: "E" },
  { id: 16, name: "Vertex", icon: "V" },
  { id: 17, name: "Luna", icon: "L" },
  { id: 18, name: "Atlas", icon: "△" },
  { id: 19, name: "Cipher", icon: "C" },
  { id: 20, name: "Metro", icon: "M" },
]

interface LogoCardProps {
  logo: typeof sampleLogos[0]
  index: number
}

function LogoCard({ logo, index }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
      style={{
        perspective: "800px",
      }}
    >
      <motion.div
        className={cn(
          "w-full h-full rounded-2xl",
          "bg-white/[0.03] dark:bg-white/[0.03]",
          "border border-white/[0.08] dark:border-white/[0.08]",
          "flex items-center justify-center",
          "transition-all duration-300",
          isHovered && "bg-white/[0.06] border-white/[0.15]"
        )}
        animate={{
          rotateX: isHovered ? mousePosition.y * -15 : 0,
          rotateY: isHovered ? mousePosition.x * 15 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Logo Icon - monochrome */}
        <div
          className={cn(
            "w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl",
            "bg-gradient-to-br from-foreground/10 to-foreground/5",
            "border border-foreground/10",
            "flex items-center justify-center",
            "text-foreground/70 font-semibold text-xl md:text-2xl",
            "transition-all duration-300",
            isHovered && "from-primary/20 to-primary/10 border-primary/20 text-primary"
          )}
          style={{
            transform: isHovered ? "translateZ(20px)" : "translateZ(0px)",
            transition: "transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
          }}
        >
          {logo.icon}
        </div>

        {/* Subtle shine effect on hover */}
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500",
            "bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent",
            isHovered && "opacity-100"
          )}
        />
      </motion.div>
    </motion.div>
  )
}

interface CarouselColumnProps {
  logos: typeof sampleLogos
  direction: "up" | "down"
  speed?: number
}

function CarouselColumn({ logos, direction, speed = 25 }: CarouselColumnProps) {
  const [isPaused, setIsPaused] = useState(false)

  // Triple the logos for seamless loop
  const tripledLogos = [...logos, ...logos, ...logos]

  return (
    <div
      className="relative h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div
        className="flex flex-col gap-3 md:gap-4"
        animate={{
          y: direction === "up" ? [0, -33.33 * logos.length * 3.5] : [-33.33 * logos.length * 3.5, 0],
        }}
        transition={{
          y: {
            duration: speed,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {tripledLogos.map((logo, index) => (
          <LogoCard key={`${logo.id}-${index}`} logo={logo} index={index % logos.length} />
        ))}
      </motion.div>
    </div>
  )
}

export function LogoCarousel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-full h-[450px] md:h-[550px] lg:h-[600px]" />
  }

  // Split logos into 5 columns
  const column1 = sampleLogos.slice(0, 4)
  const column2 = sampleLogos.slice(4, 8)
  const column3 = sampleLogos.slice(8, 12)
  const column4 = sampleLogos.slice(12, 16)
  const column5 = sampleLogos.slice(16, 20)

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main carousel container with rotation */}
      <div
        className="flex gap-3 md:gap-4 justify-center items-center"
        style={{
          transform: "rotate(5deg) translateY(-20px)",
          transformOrigin: "center center",
        }}
      >
        <div className="hidden sm:block">
          <CarouselColumn logos={column1} direction="down" speed={35} />
        </div>
        <CarouselColumn logos={column2} direction="up" speed={28} />
        <CarouselColumn logos={column3} direction="down" speed={32} />
        <CarouselColumn logos={column4} direction="up" speed={26} />
        <div className="hidden md:block">
          <CarouselColumn logos={column5} direction="down" speed={30} />
        </div>
      </div>

      {/* Bottom gradient fade - stronger */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/90 to-transparent pointer-events-none z-10" />

      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/70 to-transparent pointer-events-none z-10" />

      {/* Left fade */}
      <div className="absolute top-0 left-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none z-10" />

      {/* Right fade */}
      <div className="absolute top-0 right-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none z-10" />
    </div>
  )
}
