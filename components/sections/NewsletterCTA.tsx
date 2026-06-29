import Image from "next/image";
import { SubscribeForm } from "@/components/ui/SubscribeForm";
import { FOOTER_TILES_IMAGES } from "@/lib/assets";

// Replace with actual static asset paths once available


export function NewsletterCTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="bg-acre-newsletter-bg rounded-2xl px-8 sm:px-12 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text + form */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl font-bold text-acre-text leading-tight mb-8">
              Join farmers learning smarter ways to manage their farm
            </h2>
            <SubscribeForm />
          </div>

          {/* Image collage */}
          <div
            className="flex-shrink-0 grid grid-cols-2 gap-3 w-full max-w-xs sm:max-w-sm lg:w-64 xl:w-80"
            aria-hidden="true"
          >
            {FOOTER_TILES_IMAGES.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 120px, 160px"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

  );
}
