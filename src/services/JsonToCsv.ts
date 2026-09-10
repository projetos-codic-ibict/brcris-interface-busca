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

function hasCsvValue(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) {
    return value.some((item) => {
      if (item === null || item === undefined || item === "") return false;
      if (typeof item === "object") {
        const name = (item as { name?: unknown; title?: unknown }).name
          ?? (item as { title?: unknown }).title;
        if (Array.isArray(name)) return name.some(Boolean);
        return Boolean(name);
      }
      return true;
    });
  }
  return true;
}

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
  const values = headers.map((header) => {
    let value = source[header];
    if (header === "conference" && !hasCsvValue(value)) {
      value = source.eventName;
    }
    return formatCsvValue(value);
  });
  return values.join(csvOptions.delimiter);
}
