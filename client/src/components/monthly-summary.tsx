import { Calendar, IndianRupee, ShoppingCart, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getMonthName } from "@/lib/utils";
import type { Credit } from "@shared/schema";

interface MonthlySummaryProps {
    credits: Credit[];
    currentDate: { year: number; month: number };
    onDateChange: (date: { year: number; month: number }) => void;
}

export default function MonthlySummary({
    credits,
    currentDate,
    onDateChange,
}: MonthlySummaryProps) {
    const total = credits.reduce(
        (sum, credit) => sum + parseFloat(credit.amount),
        0
    );
    const count = credits.length;
    const average = count > 0 ? total / count : 0;

    // Count total items by splitting descriptions by comma, trimming, and filtering out empty items
    const itemCount = credits.reduce((sum, credit) => {
        if (!credit.description) return sum;
        return (
            sum +
            credit.description
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length > 0).length
        );
    }, 0);

    const changeMonth = (direction: "prev" | "next") => {
        const newDate = { ...currentDate };
        if (direction === "prev") {
            if (newDate.month === 1) {
                newDate.month = 12;
                newDate.year -= 1;
            } else {
                newDate.month -= 1;
            }
        } else {
            if (newDate.month === 12) {
                newDate.month = 1;
                newDate.year += 1;
            } else {
                newDate.month += 1;
            }
        }
        onDateChange(newDate);
    };

    return (
        <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Calendar className="text-primary" size={20} />
                    </div>
                    <div>
                        <h2
                            className="text-xl font-semibold truncate min-w-0 block"
                            style={{ color: "var(--text-main)" }}
                            title={`${getMonthName(currentDate.month)} ${
                                currentDate.year
                            }`}
                        >
                            {getMonthName(currentDate.month)} {currentDate.year}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Current Month Summary
                        </p>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeMonth("prev")}
                        className="text-secondary hover:text-secondary/80"
                    >
                        ←
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeMonth("next")}
                        className="text-secondary hover:text-secondary/80"
                    >
                        →
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Total Credits
                            </p>
                            <p className="text-2xl font-bold text-primary">
                                {formatCurrency(total)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <IndianRupee className="text-primary" size={20} />
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/5 rounded-xl p-4 border border-secondary/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Total Items
                            </p>
                            <p className="text-2xl font-bold text-secondary">
                                {itemCount}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                            <ShoppingCart
                                className="text-secondary"
                                size={20}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-accent/5 rounded-xl p-4 border border-accent/20">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">
                                Avg. Credit
                            </p>
                            <p className="text-2xl font-bold text-accent">
                                {formatCurrency(average)}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-accent" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
