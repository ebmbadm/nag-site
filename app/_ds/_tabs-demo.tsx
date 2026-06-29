"use client";
import { Tabs } from "@/components/ds";

export function TabsDemo() {
  return (
    <Tabs
      defaultValue="a"
      items={[
        { value: "a", label: "Модель A", content: <p className="text-sm text-text-muted">Панель A — TD-2000</p> },
        { value: "b", label: "Модель B", content: <p className="text-sm text-text-muted">Панель B — TD-1000</p> },
        { value: "c", label: "Модель C", content: <p className="text-sm text-text-muted">Панель C — TD-500</p> },
      ]}
    />
  );
}
