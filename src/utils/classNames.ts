export function classNames(...args: unknown[]): string {
  return args.filter(arg => !!arg).join(' ');
}