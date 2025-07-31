import { useMemo } from "react";
import { FinanceType, SummaryFilters } from "@/types/interface";

interface UseFinanceSummaryProps {
    finances: FinanceType[];
    filters: SummaryFilters;
}

const COLOR_MAP: { [key: string]: string } = {
    income: "#4caf50",      // xanh lá
    expense: "#f44336",     // đỏ
    saving: "#2196f3",      // xanh dương
    investment: "#ff9800",  // cam
    debt: "#9c27b0",        // tím
    loan: "#ff5722",        // cam đậm
    other: "#607d8b",       // xám xanh
};

export const useFinanceSummary = ({ finances, filters }: UseFinanceSummaryProps) => {
    const totals = useMemo(() => {
        const result: { [key: string]: number } = {
            income: 0,
            expense: 0,
            saving: 0,
            investment: 0,
            debt: 0,
            loan: 0,
            other: 0,
        };

        finances.forEach((finance) => {
            if (finance.type in result) {
                result[finance.type] += finance.amount;
            }
        });

        return result;
    }, [finances]);

    const COLOR_MAP: { [key: string]: string } = {
        income: "#4caf50",      // xanh lá
        expense: "#f44336",     // đỏ
        saving: "#2196f3",      // xanh dương
        investment: "#ff9800",  // cam
        debt: "#9c27b0",        // tím
        loan: "#ff5722",        // cam đậm
        other: "#607d8b",       // xám xanh
    };

    const chartData = useMemo(() => {
        const labels = Object.keys(totals).filter((key) => totals[key] > 0);
        const data = labels.map((key) => totals[key]);
        const backgroundColor = labels.map((key) => COLOR_MAP[key] || "#ccc"); // fallback màu xám nếu không có map

        return {
            labels,
            datasets: [
                {
                    data,
                    backgroundColor,
                },
            ],
        };
    }, [totals]);


    const balance = useMemo(() => {
        return (
            totals.income +
            totals.saving +
            totals.investment -
            totals.expense -
            totals.debt -
            totals.loan
        );
    }, [totals]);

    return { totals, chartData, balance };
};