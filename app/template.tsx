/**
 * Remounts on every navigation, which is what gives each route its entrance.
 * A layout would not: it persists across pages.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
