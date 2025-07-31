import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FinanceType, FinanceCategoryType, PaginationType, TransactionFilters, SummaryFilters } from "@/types/interface";
import { fetchFinances, fetchSummaryFinances, addOrUpdateFinance, deleteFinance } from "@/utils/financeApi";

interface UseFinanceDataProps {
    initialFinances: FinanceType[];
    initialCategories: FinanceCategoryType[];
    initialPagination: PaginationType;
    transactionFilters: TransactionFilters;
    summaryFilters: SummaryFilters;
    pagination: PaginationType;
}

export const useFinanceData = ({
    initialFinances,
    initialCategories,
    initialPagination,
    transactionFilters,
    summaryFilters,
    pagination,
}: UseFinanceDataProps) => {
    const queryClient = useQueryClient();
    const [categories] = useState<FinanceCategoryType[]>(initialCategories);

    const { data: transactionData, isLoading: isTransactionLoading } = useQuery({
        queryKey: ["finances", pagination.page, pagination.limit, transactionFilters],
        queryFn: () => fetchFinances({ ...pagination, ...transactionFilters }),
        initialData: { data: initialFinances, pagination: initialPagination },
    });

    const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["summaryFinances", summaryFilters.period],
        queryFn: () => fetchSummaryFinances({ period: summaryFilters.period }),
        initialData: initialFinances,
    });

    const addOrUpdateMutation = useMutation({
        mutationFn: addOrUpdateFinance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finances"] });
            queryClient.invalidateQueries({ queryKey: ["summaryFinances"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteFinance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["finances"] });
            queryClient.invalidateQueries({ queryKey: ["summaryFinances"] });
        },
    });

    return {
        categories,
        transactionFinances: transactionData.data,
        summaryFinances: summaryData,
        isLoading: isTransactionLoading || isSummaryLoading,
        addOrUpdateMutation,
        deleteMutation,
        pagination: transactionData.pagination,
    };
};