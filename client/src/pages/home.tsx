import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Receipt, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentMonth, getMonthName } from "@/lib/utils";
import CreditForm from "@/components/credit-form";
import CreditList from "@/components/credit-list";
import MonthlySummary from "@/components/monthly-summary";
import ComparisonCard from "@/components/comparison-card";
import type { Credit } from "@shared/schema";

export default function Home() {
    const showLogoutButton = true; // Set to false to hide logout button
    const [currentDate, setCurrentDate] = useState(getCurrentMonth());

    const { data: credits = [], isLoading } = useQuery<Credit[]>({
        queryKey: [
            `/api/credits/month/${currentDate.year}/${currentDate.month}`,
        ],
    });

    const scrollToForm = () => {
        const formElement = document.getElementById("credit-form");
        formElement?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: "var(--bg-warm)" }}
        >
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                <img
                                    src="/images/UdhaaroLogo.png"
                                    alt="App Logo"
                                    className="w-12 h-12"
                                />
                            </div>
                            <div>
                                <h1
                                    className="text-2xl font-bold"
                                    style={{ color: "var(--text-main)" }}
                                >
                                    Udhaaro
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Grocery Store Credits
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200"
                            >
                                <Settings
                                    size={20}
                                    style={{ color: "var(--text-main)" }}
                                />
                            </Button>
                            {showLogoutButton && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => {
                                        localStorage.removeItem("token");
                                        window.location.reload();
                                    }}
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Monthly Summary */}
                <MonthlySummary
                    credits={credits}
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                />

                {/* Add Credit Form */}
                <div id="credit-form">
                    <CreditForm onCreditAdded={setCurrentDate} />
                </div>

                {/* Credits List */}
                <CreditList credits={credits} isLoading={isLoading} />

                {/* Comparison Card */}
                <ComparisonCard credits={credits} />
            </main>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <Button
                    onClick={scrollToForm}
                    className="w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    size="icon"
                >
                    <Plus size={24} />
                </Button>
            </div>
        </div>
    );
}
