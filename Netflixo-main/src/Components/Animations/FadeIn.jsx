import React, { useEffect, useState } from 'react';

function FadeIn({ children, delay = 0, duration = 500, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div
            className={`transition-opacity ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default FadeIn;
