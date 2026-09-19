import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
};

/** Full-bleed portrait: soft cover fill + sharp full figure on top. */
export function FullBleedPortrait({ className = "", priority = false }: Props) {
  return (
    <div className={`photo-stage ${className}`}>
      <Image
        src="/mama-akingbade.jpg"
        alt=""
        fill
        priority={priority}
        className="photo-stage-fill"
        sizes="100vw"
        aria-hidden
      />
      <Image
        src="/mama-akingbade.jpg"
        alt="Mama Akingbade"
        fill
        priority={priority}
        className="photo-stage-figure"
        sizes="100vw"
      />
    </div>
  );
}
