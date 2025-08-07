
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