import { Container, Chip, Surface, Figure } from "@/components/ds";
import type { BoutiquePage } from "@/lib/content/types";

export function FeatureStrip({
  features,
  image,
}: {
  features: NonNullable<BoutiquePage["features"]>;
  image?: { src: string; alt: string };
}) {
  return (
    <Surface mode="dark" className="py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2
            className="font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-xl), 3vw, var(--text-2xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {features.title}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {features.items.map((item) => (
              <Chip key={item.title}>{item.title}</Chip>
            ))}
          </div>
        </div>
        {image ? <Figure src={image.src} alt={image.alt} className="lg:order-last" /> : null}
      </Container>
    </Surface>
  );
}
