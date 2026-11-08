import { Section, Tag, Figure } from "@/components/ds";
import type { BoutiquePage } from "@/lib/content/types";

export function FeatureStrip({
  features,
  image,
}: {
  features: NonNullable<BoutiquePage["features"]>;
  image?: { src: string; alt: string };
}) {
  return (
    <Section title={features.title}>
      <div className="flex flex-wrap gap-2">
        {features.items.map((item) => (
          <Tag key={item.title}>{item.title}</Tag>
        ))}
      </div>
      {image ? <Figure src={image.src} alt={image.alt} className="mt-8 max-w-2xl" /> : null}
    </Section>
  );
}
