"use client";
import { useState } from "react";
import { PillGroup } from "@/components/ds";

export function PillDemo() {
  const [v, setV] = useState("all");
  return (
    <PillGroup
      options={[
        { value: "all", label: "Все" },
        { value: "dsp", label: "Процессоры" },
        { value: "amps", label: "Усилители" },
        { value: "tubes", label: "Лампы" },
      ]}
      value={v}
      onChange={setV}
    />
  );
}
