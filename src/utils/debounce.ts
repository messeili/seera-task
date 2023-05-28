export const customDebounce = (cb: any, delay: number) => {
    let timer: any = undefined;
    return function (...args: any) {
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}
