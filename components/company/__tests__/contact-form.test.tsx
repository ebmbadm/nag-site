import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ContactForm } from "../contact-form";

const form = { title: "Оставить заявку", note: "Форма скоро заработает. Пока пишите на почту или звоните.", disabled: true } as const;

describe("ContactForm (stub)", () => {
  test("renders labelled fields, a disabled submit, and the note", () => {
    render(<ContactForm form={form} />);
    expect(screen.getByLabelText("Имя")).toBeInTheDocument();
    expect(screen.getByLabelText("Сообщение")).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "Отправить" });
    expect(submit).toBeDisabled();
    expect(screen.getByText(form.note)).toBeInTheDocument();
  });
});
