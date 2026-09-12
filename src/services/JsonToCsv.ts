import {
  formatPublicationType,
  formatPublicationYear,
} from "../../utils/Utils";

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

function escapeCsvCell(value: string): string {
  return value.replaceAll(";", ",");
}

function entityLabel(item: object): string {
  const rec = item as { name?: unknown; title?: unknown };
  const raw = rec.name ?? rec.title;
  if (Array.isArray(raw)) {
    return raw
      .map((part) => String(part ?? "").trim())
      .filter(Boolean)
      .join(", ");
  }
  return String(raw ?? "").trim();
}

function formatAuthorNames(value: unknown): string {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .map((item) => {
      if (typeof item === "object" && item !== null) {
        return entityLabel(item);
      }
      return String(item ?? "").trim();
    })
    .filter(Boolean)
    .map(escapeCsvCell)
    .join(",");
}

function formatCsvValue(header: string, value: unknown): string | unknown[] {
  if (header === "publicationDate") {
    return escapeCsvCell(formatPublicationYear(value));
  }
  if (header === "type") {
    return escapeCsvCell(formatPublicationType(value));
  }
  if (header === "author") {
    return formatAuthorNames(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => {
      if (typeof item === "object" && item !== null) {
        return entityLabel(item);
      }
      return String(item).replaceAll(";", ",");
    });
  }
  if (value == null || value === "") return "";
  return String(value).replaceAll(";", ",");
}

export function jsonToCsv(jsonData: object, headers: string[]): string {
  const source = jsonData as Record<string, unknown>;
  const values = headers.map((header) => formatCsvValue(header, source[header]));
  return values.join(csvOptions.delimiter);
}
