import { LogoMaker } from "@/components/logo-maker";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 text-foreground">
            Eachlabs AI Logo Maker
          </h1>
          <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
            Girişiminiz için saniyeler içinde profesyonel logolar oluşturun.
          </p>
        </div>
        
        <LogoMaker />
      </div>
    </div>
  );
}
