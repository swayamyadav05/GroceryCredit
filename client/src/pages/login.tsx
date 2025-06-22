import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
    onLoginSuccess: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                toast({
                    title: "Login Successful",
                    description: "Welcome!",
                });
                onLoginSuccess();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || "Invalid password");
            }
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error?.message || "Something went wrong.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundColor: "var(--bg-warm)" }}
        >
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <img
                        src="/images/UdhaaroLogo.png"
                        alt="logo"
                        className="w-20 h-20 mx-auto"
                    />
                    <h1 className="text-2xl font-bold mt-4">
                        Welcome to Udhaaro
                    </h1>
                    <p className="text-gray-600">
                        Please enter the password to continue.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="text-center"
                            autoFocus
                            autoComplete="current-password"
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading || !password}
                    >
                        {isLoading ? "Unlocking..." : "Unlock"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
