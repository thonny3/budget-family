'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the User type
export type User = {
    id: string;
    name: string;
    avatar?: string;
};

interface AuthContextType {
    user: User | null;
    login: (name: string, pin: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for the family budget app
const MOCK_USERS = [
    { id: '1', name: 'Jean', pin: '1234' },
    { id: '2', name: 'Marie', pin: '5678' },
    { id: '3', name: 'Admin', pin: '0000' } // For testing
];

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for persisted session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('budget_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse stored user', e);
                localStorage.removeItem('budget_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (name: string, pin: string): Promise<boolean> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundUser = MOCK_USERS.find(
            u => u.name.toLowerCase() === name.toLowerCase() && u.pin === pin
        );

        if (foundUser) {
            const userData = { id: foundUser.id, name: foundUser.name };
            setUser(userData);
            localStorage.setItem('budget_user', JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('budget_user');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
