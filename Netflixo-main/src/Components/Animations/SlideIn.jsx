import React, { useEffect, useState, useRef } from 'react';

function SlideIn({ children, direction = 'left', delay = 0, duration = 500, className = '' }) {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay]);

    const getTransform = () => {
        if (!isVisible) {
            switch (direction) {
                case 'left':
                    return 'translateX(-50px)';
                case 'right':
                    return 'translateX(50px)';
                case 'top':
                    return 'translateY(-50px)';
                case 'bottom':
                    return 'translateY(50px)';
                default:
                    return 'translateX(-50px)';
            }
        }
        return 'translate(0, 0)';
    };

    return (
        <div
            ref={elementRef}
            className={`transition-all ${className}`}
            style={{
                transform: getTransform(),
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${duration}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default SlideIn;
