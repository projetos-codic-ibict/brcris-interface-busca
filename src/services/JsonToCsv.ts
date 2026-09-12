// Interface para opções de conversão
export interface CsvOptions {
  headers?: boolean;
  delimiter?: string;
  eol?: string;
}

export const csvOptions: CsvOptions = {
  delimiter: ";",
  eol: "\r\n",
};

function formatCsvValue(value: unknown): string | unknown[] {
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "object" && item !== null) {
        return (
          (item as { name?: unknown; title?: unknown }).name ||
          (item as { title?: unknown }).title
        );
      }
      return String(item).replaceAll(";", ",");
    });
  }
  if (value == null || value === "") return "";
  return String(value).replaceAll(";", ",");
}

export function jsonToCsv(jsonData: object, headers: string[]): string {
  const source = jsonData as Record<string, unknown>;
  const values = headers.map((header) => formatCsvValue(source[header]));
  return values.join(csvOptions.delimiter);
}
