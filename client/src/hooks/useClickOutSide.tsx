import { useEffect, useRef } from 'react';

const useClickOutside = (callback) => {
    const ref = useRef(null);

    useEffect(() => {
        let handler = (e) => ref && ref.current && !ref.current.contains(e.target) && callback();

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    });

    return ref;
};

export default useClickOutside;
