import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "bag" | "arrow" | "chevron" | "menu" | "close" | "search" | "plus" | "minus" | "remove"
  | "check" | "pencil" | "book" | "pin" | "chat" | "heart" | "help" | "truck" | "phone"
  | "grid" | "reset" | "eraser";

const paths: Record<IconName, ReactNode> = {
  heart: <path d="M20.5 4.8a5 5 0 0 0-7.1 0L12 6.2l-1.4-1.4a5 5 0 0 0-7.1 7.1L12 21l8.5-9.1a5 5 0 0 0 0-7.1Z" />,
  bag: <><path d="M5 8.5h14l1.1 12.5H3.9L5 8.5Z" /><path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" /></>,
  arrow: <path d="M4.5 12h14m-6-6 6 6-6 6" />,
  chevron: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  menu: <path d="M4 8.5h16M4 15.5h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m15.4 15.4 4.1 4.1" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  remove: <><path d="M4.5 7h15M9 7V4.8h6V7m2 0-.8 13H7.8L7 7" /><path d="M10 10v6m4-6v6" /></>,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  pencil: <><path d="m4 16 12-12 4 4L8 20l-5 1Z" /><path d="m13 7 4 4" /></>,
  book: <path d="M12 5v16M3 4c4-1 7 0 9 2 2-2 5-3 9-2v15c-4-1-7 0-9 2-2-2-5-3-9-2Z" />,
  pin: <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2" /></>,
  chat: <path d="M20.5 11.5a8.5 8.5 0 0 1-12.4 7.6L3.5 20.5l1.4-4.3a8.5 8.5 0 1 1 15.6-4.7Z" />,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.6 9.3a2.5 2.5 0 0 1 4.9.7c0 1.7-2.5 2.2-2.5 3.8" /><path d="M12 17h.01" /></>,
  truck: <><path d="M2.5 6.5h11v9h-11z" /><path d="M13.5 9.5h4l3 3v3h-7" /><circle cx="6.5" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>,
  phone: <><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M10.5 18.5h3" /></>,
  grid: <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>,
  reset: <><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4.5 4.5v4h4" /></>,
  eraser: <><path d="m8.5 20 -4.8-4.8a1.8 1.8 0 0 1 0-2.5l8.8-8.8a1.8 1.8 0 0 1 2.5 0l5.1 5.1a1.8 1.8 0 0 1 0 2.5L11.5 20Z" /><path d="M8.5 20H20M9 9.3l5.7 5.7" /></>,
};

export function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" viewBox="0 0 24 24" {...props}>
      {paths[name]}
    </svg>
  );
}
