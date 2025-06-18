import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { List, Edit2, Trash2, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate, getCurrentMonth } from "@/lib/utils";
import type { Credit } from "@shared/schema";

interface CreditListProps {
  credits: Credit[];
  isLoading: boolean;
}

export default function CreditList({ credits, isLoading }: CreditListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentDate = getCurrentMonth();

  const deleteCreditMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/credits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/credits"] });
      queryClient.invalidateQueries({ 
        queryKey: [`/api/credits/month/${currentDate.year}/${currentDate.month}`] 
      });
      toast({
        title: "Success",
        description: "Credit entry deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete credit entry",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    deleteCreditMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <Skeleton className="w-32 h-6" />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="w-48 h-5 mb-2" />
                  <Skeleton className="w-32 h-4" />
                </div>
                <Skeleton className="w-20 h-6" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <List className="text-secondary" size={20} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>
              Credit History
            </h2>
          </div>
        </div>
      </div>
      
      {credits.length === 0 ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">No credits recorded</h3>
          <p className="text-gray-500">Add your first credit entry to get started.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {credits.map((credit) => (
            <div key={credit.id} className="transaction-row">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Receipt className="text-primary" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-medium truncate" style={{ color: "var(--text-main)" }}>
                          {credit.description}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(credit.date)}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xl font-bold text-primary">
                          {formatCurrency(credit.amount)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-secondary hover:text-secondary/80 transition-colors p-1"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Credit Entry</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this credit entry? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(credit.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                  disabled={deleteCreditMutation.isPending}
                                >
                                  {deleteCreditMutation.isPending ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
