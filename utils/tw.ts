import { twMerge } from "tailwind-merge";

type TailwindClasses = string | undefined | null | false;

export const cn = (...args: (TailwindClasses | Record<string, boolean>)[]) => {
  const classNames: string[] = [];

  args.forEach(arg => {
    if (typeof arg === 'string') {
      classNames.push(arg);
    } else if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      Object.keys(arg).forEach(key => {
        if (arg[key]) {
          classNames.push(key);
        }
      });
    }
  });

  return twMerge(...classNames);
};
