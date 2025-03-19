import { format, FormatOptions } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Locale } from "date-fns"; // Importação correta do tipo Locale

// Função para capitalizar a primeira letra de cada palavra
export const capitalizeFirstLetter = (string: string): string => {
  return string.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

// Função para formatar datas com a primeira letra maiúscula
export const formatDateCapitalized = (
  date: Date | number,
  formatStr: string,
  options?: { locale?: Locale } & FormatOptions
): string => {
  const formatted = format(date, formatStr, { locale: ptBR, ...options });
  return capitalizeFirstLetter(formatted);
};