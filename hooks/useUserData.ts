import { useState, useEffect } from 'react';

export function useUserData() {
    const [userName, setUserNameState] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('life-dashboard-user-v1');
            if (stored) {
                setUserNameState(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to parse user data:', error);
        }
        setIsLoaded(true);
    }, []);

    const setUserName = (name: string) => {
        try {
            localStorage.setItem('life-dashboard-user-v1', JSON.stringify(name));
            setUserNameState(name);
        } catch (error) {
            console.error('Failed to save user data:', error);
        }
    };

    return {
        userName,
        setUserName,
        isLoaded,
        isFirstTime: isLoaded && userName === null
    };
}
