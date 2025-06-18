import { useState } from "react";
import { Scale, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import type { Credit } from "@shared/schema";

interface ComparisonCardProps {
  credits: Credit[];
}

export default function ComparisonCard({ credits }: ComparisonCardProps) {
  const [storeTotal, setStoreTotal] = useState<string>("");
  const { toast } = useToast();

  const yourTotal = credits.reduce((sum, credit) => sum + parseFloat(credit.amount), 0);
  const storeTotalNum = parseFloat(storeTotal) || 0;
  const difference = yourTotal - storeTotalNum;

  const handleReconcile = () => {
    if (!storeTotal) {
      toast({
        title: "Error",
        description: "Please enter the store total first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Reconciled",
      description: `Records reconciled with a difference of ${formatCurrency(Math.abs(difference))}`,
    });
    
    // Reset store total after reconciliation
    setStoreTotal("");
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Scale className="text-accent" size={20} />
        </div>
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>
          Store Comparison
        </h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-lg font-medium" style={{ color: "var(--text-main)" }}>
            Your Records
          </span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(yourTotal)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
          <span className="text-lg font-medium" style={{ color: "var(--text-main)" }}>
            Store Total
          </span>
          <Input
            type="number"
            step="0.01"
            placeholder="Enter store total"
            value={storeTotal}
            onChange={(e) => setStoreTotal(e.target.value)}
            className="text-2xl font-bold text-right border-0 bg-transparent text-secondary focus:ring-0 p-0 w-32 h-auto"
          />
        </div>
        
        <div className="flex justify-between items-center p-4 bg-accent/5 rounded-xl border border-accent/20">
          <span className="text-lg font-semibold" style={{ color: "var(--text-main)" }}>
            Difference
          </span>
          <span className={`text-2xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {storeTotal ? formatCurrency(difference) : formatCurrency(0)}
          </span>
        </div>
        
        <Button
          onClick={handleReconcile}
          className="secondary-button w-full flex items-center justify-center space-x-2"
          disabled={!storeTotal}
        >
          <Check size={20} />
          <span>Mark as Reconciled</span>
        </Button>
      </div>
    </Card>
  );
}
