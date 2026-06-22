import Image, { type StaticImageData } from "next/image";

interface HeroImageCollageProps {
  images: Array<StaticImageData | string>;
  side: "left" | "right";
  /**
   * Tile sizes in px ordered outermost → innermost column.
   * Length determines the number of columns.
   * e.g. [100, 80, 64] = 3 cols, largest on outer edge.
   */
  tileSizes: number[];
}

const GAP = 8; // matches gap-2 (0.5rem at 16px base)

/**
 * Decorative image collage that bleeds off the left or right edge of the hero.
 * Tiles taper in size from the outer edge toward the center.
 * The innermost column is vertically centered, creating an inward-pointing arrow shape.
 * Must be rendered inside a `relative overflow-hidden` container.
 */
export function HeroImageCollage({ images, side, tileSizes }: HeroImageCollageProps) {
  const positionClass = side === "left" ? "left-0" : "right-0";

  // tileSizes is outer→inner. For left, col 0 is outer so order matches.
  // For right, col 0 is inner (left side of grid) so reverse.
  const colSizes = side === "left" ? tileSizes : [...tileSizes].reverse();
  const cols = colSizes.length;

  // For side="right", pad leading nulls so the incomplete row falls at the
  // innermost (leftmost) column rather than the outermost.
  const remainder = images.length % cols;
  const leadingNulls = side === "right" && remainder !== 0 ? cols - remainder : 0;
  const items: Array<(typeof images)[number] | null> = [
    ...Array(leadingNulls).fill(null),
    ...images,
  ];

  // Group items into per-column arrays for independent vertical alignment.
  const columns = Array.from({ length: cols }, (_, colIdx) =>
    items.filter((_, i) => i % cols === colIdx)
  );

  // Total collage height is driven by the outermost (largest) column.
  const numRows = Math.ceil(items.length / cols);
  const collageHeight = tileSizes[0] * numRows + GAP * (numRows - 1);

  // Innermost column index in the rendered L→R order.
  const innermostColIdx = side === "left" ? cols - 1 : 0;

  return (
    <div
      className={`hidden lg:flex absolute ${positionClass} top-1/2 -translate-y-1/2 gap-2 opacity-90`}
      aria-hidden="true"
    >
      {columns.map((colImages, colIdx) => {
        const size = colSizes[colIdx];
        const isInnermost = colIdx === innermostColIdx;
        return (
          <div
            key={colIdx}
            className={`flex flex-col gap-2 ${isInnermost ? "justify-center" : "justify-start"}`}
            style={{ height: collageHeight }}
          >
            {colImages.map((src, rowIdx) =>
              src === null ? null : (
                <div
                  key={rowIdx}
                  className="relative rounded-xl overflow-hidden flex-shrink-0"
                  style={{ width: size, height: size }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={`${size}px`}
                  />
                </div>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
