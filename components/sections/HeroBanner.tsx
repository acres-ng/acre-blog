import { SubscribeForm } from "@/components/ui/SubscribeForm";
import { HeroImageCollage } from "@/components/ui/HeroImageCollage";
import { HERO_IMAGES_LEFT, HERO_IMAGES_RIGHT } from "@/lib/assets";

export function HeroBanner() {
  return (
    <section className="relative bg-acre-hero-bg overflow-hidden">
      {/* Collages positioned relative to the section so they bleed off edges */}
      {/* tileSizes: outermost → innermost column — identical on both sides for consistent layout */}
      <HeroImageCollage images={HERO_IMAGES_LEFT} side="left" tileSizes={[100, 80, 64]} />
      <HeroImageCollage images={HERO_IMAGES_RIGHT} side="right" tileSizes={[100, 80, 64]} />

      {/* Centre content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-acre-green text-xs sm:text-sm font-semibold uppercase tracking-widest mb-4">
            Our Blog
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-acre-text leading-tight mb-4">
            Everything you need to run a better farm
          </h1>
          <p className="text-acre-muted text-sm sm:text-base mb-8 max-w-lg mx-auto">
            Get practical farming tips, product updates, and operational
            insights delivered to your inbox.
          </p>
          <div className="flex justify-center">
            <SubscribeForm />
          </div>
        </div>
      </div>
    </section>
  );
}
