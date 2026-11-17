import type { ReactNode, SVGProps } from "react";

type IconName = "bag" | "arrow" | "menu" | "close" | "search" | "plus" | "minus" | "remove" | "cart" | "user" | "pause" | "play" | "pencil" | "book" | "pin" | "chat" | "heart";

const paths: Record<IconName, ReactNode> = {
  heart: <path d="M20.5 4.8a5 5 0 0 0-7.1 0L12 6.2l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-9.1a5 5 0 0 0 0-7.1Z" />,
  cart: <><path d="M3 4h2l3 12h11l2-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
  user: <><circle cx="12" cy="7" r="3" /><path d="M6 21v-5a6 6 0 0 1 12 0v5Z" /></>,
  pause: <path d="M9 5v14M15 5v14" />,
  play: <path d="m8 4 12 8-12 8Z" />,
  pencil: <><path d="m4 16 12-12 4 4L8 20l-5 1Z" /><path d="m13 7 4 4" /></>,
  book: <><path d="M12 5v16M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z" /></>,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  chat: <path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 0 1 19 0ZM7 9h10M7 13h7" />,
  bag: (
    <>
      <path d="M5 8.5h14l1.2 12H3.8L5 8.5Z" />
      <path d="M8 9V6.8a4 4 0 0 1 8 0V9" />
    </>
  ),
  arrow: <path d="M4.5 12h14m-6-6 6 6-6 6" />,
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.4 15.4 4.1 4.1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  remove: (
    <>
      <path d="M4.5 7h15M9 7V4.8h6V7m2 0-.8 13H7.8L7 7" />
      <path d="M10 10v6m4-6v6" />
    </>
  ),
};

export function Icon({
  name,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
