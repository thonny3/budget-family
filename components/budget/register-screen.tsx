'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Lock, User as UserIcon, UserPlus } from 'lucide-react';

interface RegisterScreenProps {
    onSwitchToLogin: () => void;
}

export default function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password || !confirmPassword) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        if (password.length < 6) {
            toast.error('Le mot de passe doit comporter au moins 6 caractères');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        setIsLoading(true);
        try {
            const success = await register(username, password);
            if (success) {
                toast.success(`Bienvenue dans la famille, ${username} !`);
            } else {
                toast.error('Ce nom d\'utilisateur est déjà pris');
            }
        } catch (error) {
            toast.error('Une erreur est survenue lors de l\'inscription');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md border-border bg-card text-card-foreground shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <UserPlus className="h-6 w-6 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">Rejoindre la Famille</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Créez votre profil pour commencer à gérer le budget
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Nom du membre</Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="username"
                                    placeholder="Ex: Thomas, Sarah..."
                                    className="pl-9 bg-input border-input text-foreground"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe (6+ caractères)</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9 bg-input border-input text-foreground"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-9 bg-input border-input text-foreground"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Création...' : 'Créer mon profil'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 text-center">
                    <div className="text-sm text-muted-foreground">
                        Vous avez déjà un compte ?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-primary hover:underline font-medium"
                        >
                            Connectez-vous
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
