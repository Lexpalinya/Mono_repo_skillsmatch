export function formatNumberWithComma(num: number | string): string {
    const parsed = typeof num === "string" ? parseFloat(num.replace(/,/g, "")) : num;
    if (isNaN(parsed)) return "0";
    return parsed.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
