
export const getFrenchGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return "Bonjour, HuyBoon"; // Good morning
    if (hour >= 11 && hour < 14) return "Bon appétit, HuyBoon"; // Around lunch
    if (hour >= 14 && hour < 18) return "Bon après-midi, HuyBoon"; // Good afternoon
    if (hour >= 18 && hour < 22) return "Bonsoir, HuyBoon"; // Good evening
    return "Bonne nuit, HuyBoon"; // Good night
};

// Xoá hết ký tự không phải số và trả về chuỗi chỉ chứa chữ số
export const unformatNumber = (raw: string) => raw.replace(/\D/g, "");

// Thêm dấu chấm hàng nghìn: "1234567" -> "1.234.567"
export const formatNumber = (digits: string) => {
    if (!digits) return "";
    // Xóa số 0 đứng đầu nếu có (trừ khi chỉ là "0")
    const normalized = digits.replace(/^0+(?=\d)/, "");
    return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};




export const parseNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, ""));
};

