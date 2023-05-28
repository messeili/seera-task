import {useEffect} from 'react';
import {customDebounce} from "@/utils/debounce";

const useInfiniteScroll = (onScrollEnd: () => void) => {
    useEffect(() => {
        const handleScroll = customDebounce(() => {
            const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
            const scrollThreshold = (scrollHeight - clientHeight)  - (scrollHeight * 0.15); // 15% of the scrollHeight

            if (scrollTop >= scrollThreshold) {
                onScrollEnd();
            }
        }, 500);

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [onScrollEnd]);
};

export default useInfiniteScroll;
