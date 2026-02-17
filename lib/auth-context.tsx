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
    login: (name: string, password: string) => Promise<boolean>;
    register: (name: string, password: string) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<{ id: string, name: string, password: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load
    useEffect(() => {
        const storedUsers = localStorage.getItem('budget_users');
        if (storedUsers) {
            setUsers(JSON.parse(storedUsers));
        } else {
            // Initial mock users if none exist
            const initialUsers = [
                { id: '1', name: 'Jean', password: '1234' },
                { id: '2', name: 'Marie', password: '5678' },
                { id: '3', name: 'Admin', password: '0000' }
            ];
            setUsers(initialUsers);
            localStorage.setItem('budget_users', JSON.stringify(initialUsers));
        }

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

    const login = async (name: string, password: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        const foundUser = users.find(
            u => u.name.toLowerCase() === name.toLowerCase() && u.password === password
        );

        if (foundUser) {
            const userData = { id: foundUser.id, name: foundUser.name };
            setUser(userData);
            localStorage.setItem('budget_user', JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const register = async (name: string, password: string): Promise<boolean> => {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check if user already exists
        if (users.find(u => u.name.toLowerCase() === name.toLowerCase())) {
            return false;
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            password
        };

        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('budget_users', JSON.stringify(updatedUsers));

        // Auto login after registration
        const userData = { id: newUser.id, name: newUser.name };
        setUser(userData);
        localStorage.setItem('budget_user', JSON.stringify(userData));

        return true;
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
                register,
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
