import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Calendar, DollarSign, ShoppingBag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertCreditSchema, type InsertCredit } from "@shared/schema";
import { getCurrentMonth } from "@/lib/utils";

export default function CreditForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentDate = getCurrentMonth();

  const form = useForm<InsertCredit>({
    resolver: zodResolver(insertCreditSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
    },
  });

  const createCreditMutation = useMutation({
    mutationFn: async (data: InsertCredit) => {
      const response = await apiRequest("POST", "/api/credits", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/credits/month/${currentDate.year}/${currentDate.month}`] 
      });
      form.reset({
        date: new Date().toISOString().split('T')[0],
        description: "",
        amount: "",
      });
      toast({
        title: "Success",
        description: "Credit entry added successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add credit entry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCredit) => {
    createCreditMutation.mutate(data);
  };

  const clearForm = () => {
    form.reset({
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
    });
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Plus className="text-success" size={20} />
        </div>
        <h2 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>
          Add New Credit
        </h2>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <Label htmlFor="date" className="block text-base font-medium mb-2" style={{ color: "var(--text-main)" }}>
              <Calendar className="inline text-gray-500 mr-2" size={16} />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              {...form.register("date")}
              className="large-input"
            />
            {form.formState.errors.date && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.date.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="amount" className="block text-base font-medium mb-2" style={{ color: "var(--text-main)" }}>
              <DollarSign className="inline text-gray-500 mr-2" size={16} />
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...form.register("amount")}
              className="large-input"
            />
            {form.formState.errors.amount && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.amount.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="description" className="block text-base font-medium mb-2" style={{ color: "var(--text-main)" }}>
            <ShoppingBag className="inline text-gray-500 mr-2" size={16} />
            Item Description
          </Label>
          <Input
            id="description"
            type="text"
            placeholder="e.g., Bread - expired, Milk - damaged package"
            {...form.register("description")}
            className="large-input"
          />
          {form.formState.errors.description && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            type="submit"
            disabled={createCreditMutation.isPending}
            className="primary-button flex-1 flex items-center justify-center space-x-2"
          >
            <Plus size={20} />
            <span>{createCreditMutation.isPending ? "Adding..." : "Add Credit"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            className="sm:w-auto bg-gray-100 hover:bg-gray-200 font-semibold py-4 px-6 rounded-xl text-lg transition-colors"
            style={{ color: "var(--text-main)" }}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}
