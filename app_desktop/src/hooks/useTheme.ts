import { useState, useEffect } from 'react';

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check if user has a theme preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Update localStorage when theme changes
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update document class for Tailwind dark mode
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return { isDarkMode, toggleTheme };
} 