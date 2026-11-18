import { site } from "../data/site";

const links = [
  { href: "#work", label: "עבודות" },
  { href: "#brands", label: "מותגים" },
  { href: "#contact", label: "דברו איתי" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur">
      <nav
        aria-label="ניווט ראשי"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8"
      >
        <a href="#top" className="font-serif text-xl font-black leading-none">
          {site.name}
        </a>
        <ul className="flex items-center gap-5 text-sm font-medium sm:gap-8 sm:text-base">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-draw pb-0.5">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
