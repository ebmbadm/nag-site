import { describe, expect, test } from "vitest";
import { garantiya } from "../garantiya";

describe("garantiya service copy", () => {
  test("covers NAG, NOVIK, complex repairs, and lamp consultation", () => {
    const text = garantiya.service.blocks.map((block) => block.text).join(" ");
    expect(text).toContain("DSP‑процессоров, усилителей и встраиваемых модулей NAG");
    expect(text).toContain("всех изделий NOVIK: ламповых усилителей и акустических систем");
    expect(text).toContain("Marshall, Fender, Mesa/Boogie, ENGL, Diezel, Laney");
    expect(text).toContain("подбором и консультируем по лампам");
  });
});
