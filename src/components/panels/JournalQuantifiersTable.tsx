import { useEffect, useMemo } from "react";
import { useTranslation } from "next-i18next";
import useRequest from "../../hooks/useRequest";
import { withBasePath } from "../../lib/basePath";
import type {
  PublicationsDashboardFilters,
  PublicationsJournalQuantifierPoint,
  PublicationsJournalQuantifiers,
} from "../../types/PublicationsDashboard";
import PanelTable, { type PanelTableColumn } from "./PanelTable";

type Props = {
  filters: PublicationsDashboardFilters;
};

function formatNumber(value: number, locale: string) {
  console.log("value:", value);
  return new Intl.NumberFormat(locale).format(value);

}

function buildUrl(filters: PublicationsDashboardFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([field, value]) => {
    if (value) params.set(field, value);
  });

  const query = params.toString();

  return query ? withBasePath(`/api/dashboard/journal-quantifiers?${query}`) : withBasePath("/api/dashboard/journal-quantifiers");

}

export default function JournalQuantifiersTable({ filters }: Props) {
  const { t } = useTranslation("common");
  const { data, loading, error, get } = useRequest<PublicationsJournalQuantifiers>();

  useEffect(() => {
    get(buildUrl(filters));

  }, [filters, get]);

  const items = data?.items ?? [];

  // Define as colunas da tabela
  const columns = useMemo<
    PanelTableColumn<PublicationsJournalQuantifierPoint>[]
  >(
    () => [
      {
        key: "rank",
        header: "#",
        accessor: (row) => row.rank,
        sortAs: "number",
      },
      {
        key: "title",
        header: t("Publication"),
        accessor: (row) => row.title,
        sortAs: "text",
        title: (row) => row.title,
      },
      {
        key: "publications",
        header: t("Publications"),
        accessor: (row) => row.publications,
        align: "right",
        sortAs: "number",
        format: (value, _row, locale) => formatNumber(Number(value), locale),
      },
      {
        key: "conferences",
        header: t("Conferences"),
        accessor: (row) => row.conferences,
        align: "right",
        sortAs: "number",
        format: (value, _row, locale) => formatNumber(Number(value), locale),
      },
      {
        key: "journals",
        header: t("Periodicals"),
        accessor: (row) => row.journals,
        align: "right",
        sortAs: "number",
        format: (value, _row, locale) => formatNumber(Number(value), locale),
      },
      {
        key: "authors",
        header: t("Authors"),
        accessor: (row) => row.authors,
        align: "right",
        sortAs: "number",
        format: (value, _row, locale) => formatNumber(Number(value), locale),
      },
      {
        key: "sponsors",
        header: t("Funding"),
        accessor: (row) => row.sponsors,
        align: "right",
        sortAs: "number",
        format: (value, _row, locale) => formatNumber(Number(value), locale),
      },
    ],
    [t],
  );

  return (
    <PanelTable
      title={t("Journal quantifiers")}
      caption={t("Journal quantifiers in selected range")}
      items={items}
      columns={columns}
      getRowKey={(row) => `${row.rank}-${row.title}`}
      loading={loading}
      error={Boolean(error)}
      initialSortKey="publications"
      initialSortDirection="desc"
    />
  );
}
