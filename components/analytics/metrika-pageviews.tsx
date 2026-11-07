"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { hit } from "./yandex-metrika";

/**
 * next/link swaps pages without a reload, so the tag only ever saw the landing
 * page. Since the replatform that halved page depth and hid the path from a
 * category to a product.
 */
export function MetrikaPageviews() {
  const pathname = usePathname();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const url = window.location.href;
    if (previous.current && previous.current !== url) hit(url, previous.current);
    previous.current = url;
  }, [pathname]);

  return null;
}
