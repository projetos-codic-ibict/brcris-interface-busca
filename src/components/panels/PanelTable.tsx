import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "next-i18next";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ChartFeedback from "./ChartFeedback";

// Tipos de ordenação
export type PanelTableSortDirection = "asc" | "desc";

// Atributos de uma coluna da tabela
export type PanelTableColumn<T> = {
  key: string;
  header: string;
  accessor: (row: T) => string | number;
  align?: "left" | "right";
  sortable?: boolean;
  /** Texto inicia em asc; número em desc (padrão). */
  sortAs?: "text" | "number";
  format?: (value: string | number, row: T, locale: string) => ReactNode;
  title?: (row: T) => string;
};

// Props do componente
type Props<T> = {
  title: string;
  caption: string;
  items: T[];
  columns: PanelTableColumn<T>[];
  getRowKey: (row: T) => string;
  loading: boolean;
  error: boolean;
  initialSortKey: string;
  initialSortDirection?: PanelTableSortDirection;
  pageSize?: number;
  feedbackHeight?: number;
};

// Função responsável por comparar dois valores em relação à direção de ordenação
function compareValues(
  left: string | number,
  right: string | number,
  direction: PanelTableSortDirection,
) {
  const result =
    typeof left === "number" && typeof right === "number"
      ? left - right
      : String(left).localeCompare(String(right), undefined, {
          sensitivity: "base",
          numeric: true,
        });

  return direction === "asc" ? result : -result;
}

// Componente principal da tabela
export default function PanelTable<T>({
  title,
  caption,
  items,
  columns,
  getRowKey,
  loading,
  error,
  initialSortKey,
  initialSortDirection = "desc",
  pageSize = 10,
  feedbackHeight = 220,
}: Props<T>) {
  const { t, i18n } = useTranslation("common");
  const locale = i18n.language || "pt-BR";
  const empty = !loading && !error && items.length === 0;

  const [page, setPage] = useState(1); // Página atual
  const [sortKey, setSortKey] = useState(initialSortKey); // Chave de ordenação
  const [sortDirection, setSortDirection] = useState<PanelTableSortDirection>(initialSortDirection); // Direção de ordenação

  useEffect(() => {
    setPage(1); // Volta para a primeira página quando os dados mudam
    setSortKey(initialSortKey); // Volta para a chave de ordenação inicial
    setSortDirection(initialSortDirection); // Volta para a direção de ordenação inicial

  }, [items, initialSortKey, initialSortDirection]);

  // Ordena os itens com base na chave e direção de ordenação
  const sortedItems = useMemo(() => {
    const column = columns.find((item) => item.key === sortKey);
    if (!column) return items;

    const next = [...items];
    next.sort((a, b) => compareValues(column.accessor(a), column.accessor(b), sortDirection) );
    
    return next;

  }, [items, columns, sortKey, sortDirection]);

  // Calcula o total de páginas
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));

  // Calcula os itens da página atual
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;

    return sortedItems.slice(start, start + pageSize);

  }, [sortedItems, page, pageSize]);

  // Calcula os números de página
  const pageNumbers = useMemo(() => {
    const windowSize = 5;
    const start = Math.max(1, Math.min(page - 2, totalPages - windowSize + 1));
    const end = Math.min(totalPages, start + windowSize - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i); // Retorna um array com os números de página
  
  }, [page, totalPages]);

  // Função responsável por ordenar os itens com base na chave
  function handleSort(column: PanelTableColumn<T>) {
    if (column.sortable === false) return;

    setPage(1); // Volta para a primeira página quando a chave de ordenação muda

    if (sortKey === column.key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(column.key); // Define a chave de ordenação
    setSortDirection(column.sortAs === "text" ? "asc" : "desc");
  }

  // Função responsável por exibir o ícone de ordenação
  function sortIcon(key: string) {
    if (sortKey !== key) return <ArrowUpDown size={12} aria-hidden />;
    return sortDirection === "asc" ? (
      <ArrowUp size={12} aria-hidden />
    ) : (
      <ArrowDown size={12} aria-hidden />
    );
  }

  return (
    <div className="brcris-chart-card brcris-panel-table">
      <div className="brcris-panel-table__header">
        <h3 className="brcris-chart-card__title">{title}</h3>
        <p className="brcris-panel-table__caption">{caption}</p>
      </div>

      <div className="brcris-panel-table__body" aria-busy={loading}>
        <ChartFeedback
          height={feedbackHeight}
          loading={loading}
          error={error}
          empty={empty}
        />

        {!loading && !error && !empty ? (
          <>
            <div className="brcris-panel-table__scroll">
              <table className="brcris-panel-table__table">
                <thead>
                  <tr>
                    {columns.map((column) => {
                      const active = sortKey === column.key;
                      const ariaSort =
                        column.sortable === false
                          ? undefined
                          : active
                            ? sortDirection === "asc"
                              ? "ascending"
                              : "descending"
                            : "none";
                      const className =
                        column.align === "right" ? "is-numeric" : undefined;

                      if (column.sortable === false) {
                        return (
                          <th
                            key={column.key}
                            scope="col"
                            className={className}
                          >
                            {column.header}
                          </th>
                        );
                      }

                      return (
                        <th
                          key={column.key}
                          scope="col"
                          className={className}
                          aria-sort={ariaSort}
                        >
                          <button
                            type="button"
                            className={ active ? "brcris-panel-table__sort-btn is-active" : "brcris-panel-table__sort-btn"} 
                            onClick={() => handleSort(column)}
                            aria-label={t("Sort by column", {
                              column: column.header,
                            })}
                          >
                            <span>{column.header}</span>
                            {sortIcon(column.key)}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((row) => (
                    <tr key={getRowKey(row)}>
                      {columns.map((column) => {
                        const value = column.accessor(row);
                        const className = column.align === "right" ? "is-numeric" : undefined;
                        const content = column.format ? column.format(value, row, locale) : value;
                        const cellTitle = column.title ? column.title(row) : undefined;

                        return (
                          <td
                            key={column.key}
                            className={className}
                            title={cellTitle}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <div className="brcris-panel-table__pagination" role="navigation">
                <button
                  type="button"
                  className="brcris-panel-table__page-btn"
                  disabled={page <= 1}
                  aria-label={t("Previous page")}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft size={16} />
                </button>

                {pageNumbers[0] > 1 ? (
                  <>
                    <button
                      type="button"
                      className="brcris-panel-table__page-btn"
                      onClick={() => setPage(1)}
                    >
                      1
                    </button>
                    {pageNumbers[0] > 2 ? (
                      <span className="brcris-panel-table__page-ellipsis">
                        …
                      </span>
                    ) : null}
                  </>
                ) : null}

                {pageNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={ n === page ? "brcris-panel-table__page-btn is-active" : "brcris-panel-table__page-btn"}
                    aria-current={n === page ? "page" : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}

                {pageNumbers[pageNumbers.length - 1] < totalPages ? (
                  <>
                    {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
                      <span className="brcris-panel-table__page-ellipsis">
                        …
                      </span>
                    ) : null}
                    <button
                      type="button"
                      className="brcris-panel-table__page-btn"
                      onClick={() => setPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  className="brcris-panel-table__page-btn"
                  disabled={page >= totalPages}
                  aria-label={t("Next page")}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
