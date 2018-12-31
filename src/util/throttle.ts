export default function throttle(fn: Function, delay: number, runInitially: boolean = false): (...args: any) => void {
  let timer: any;
  return function (...args: any) {
    if (timer) {
      clearTimeout(timer);
    } else if (runInitially) {
      timer = true;
      fn(...args);
    }
    timer = setTimeout(() => fn(...args), delay);
  };
}
