'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User as UserIcon } from 'lucide-react';

interface LoginScreenProps {
    onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
    const { login } = useAuth();
    const [username, setUsername] = useState('Jean'); // Default for convenience
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsLoading(true);
        try {
            const success = await login(username, password);
            if (success) {
                toast.success(`Bienvenue, ${username} !`); // Removed emoji to avoid unicode issues if any
            } else {
                toast.error('Identifiants incorrects');
            }
        } catch (error) {
            toast.error('Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">Budget Familial</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Connectez-vous pour gérer vos finances
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-foreground">Membre</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    placeholder="Jean / Marie"
                                    className="pl-9 bg-input border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9 bg-input border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center">
                    <div className="text-sm text-muted-foreground">
                        Nouveau membre ?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-primary hover:underline font-medium"
                        >
                            Inscrivez-vous ici
                        </button>
                    </div>
                    <div className="text-xs text-muted-foreground pt-4 border-t w-full">
                        Codes démo : Jean/1234, Marie/5678
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
