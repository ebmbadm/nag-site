import { HubCard } from "@/components/company/hub-card";
import type { BoutiqueAreaCard } from "@/lib/content/types";

export function AreaCards({ cards }: { cards: BoutiqueAreaCard[] }) {
  return (
    <div>
      {cards.map((card) => (
        <HubCard key={card.href} card={card} />
      ))}
    </div>
  );
}
