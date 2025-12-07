import React from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../Context/ThemeContext';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-dry border border-border hover:border-subMain transitions"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? (
                <FiSun className="text-xl text-yellow-500" />
            ) : (
                <FiMoon className="text-xl text-blue-500" />
            )}
        </button>
    );
}

export default ThemeToggle;
