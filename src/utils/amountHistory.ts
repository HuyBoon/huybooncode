export const getAmountHistory = (): number[] => {
    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("financeAmountHistory");
        return saved ? JSON.parse(saved) : [30000, 100000];
    }
    return [30000, 100000];
};

export const saveAmountToHistory = (
    amount: number,
    setAmountHistory: React.Dispatch<React.SetStateAction<number[]>>
) => {
    setAmountHistory((prev) => {
        const updatedHistory = Array.from(new Set([amount, ...prev])).slice(0, 10);
        if (typeof window !== "undefined") {
            localStorage.setItem("financeAmountHistory", JSON.stringify(updatedHistory));
        }
        return updatedHistory;
    });
};