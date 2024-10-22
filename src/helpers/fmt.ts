export const toMoney = (number: number, abs: boolean = false) => {
  return Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(abs ? Math.abs(number) : number);
};
