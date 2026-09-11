import type { NextApiRequest, NextApiResponse } from "next";
import { createElasticsearchClient } from "../../../services/ElasticsearchClient";
import logger from "../../../services/Logger";
import type {
  PublicationsDashboardErrorResponse,
  PublicationsJournalQuantifiers,
} from "../../../types/PublicationsDashboard";

const client = createElasticsearchClient();
const TITLE_SIZE = 50;
const YEAR_FROM = "1960";

const TYPES = [
  "conference proceedings",
  "journal article",
  "article",
  "book",
  "book-chapter",
  "editorial",
  "dataset",
  "erratum",
  "Artigo",
  "Artigo de Conferência",
  "Capítulo de Livro",
  "Conjunto de Dados",
  "Livro",
  "Preprint",
];

function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    PublicationsJournalQuantifiers | PublicationsDashboardErrorResponse
  >,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Metodo nao permitido." });
  }

  const index = process.env.INDEX_PUBLICATION;
  if (!index) {
    return res.status(500).json({ error: "Servico indisponivel." });
  }

  const publicationDate = param(req.query.publicationDate);
  const type = param(req.query.type);
  const language = param(req.query.language);
  const institution = param(req.query.institution);
  const yearTo = String(new Date().getFullYear());

  const filters: Record<string, unknown>[] = [
    { range: { publicationDate: { gte: YEAR_FROM, lte: yearTo } } },
    {
      bool: {
        should: TYPES.map((value) => ({ term: { type: value } })),
        minimum_should_match: 1,
      },
    },
  ];

  if (publicationDate) filters.push({ term: { publicationDate } });
  if (type) filters.push({ term: { type } });
  if (language) filters.push({ term: { language } });
  if (institution) {
    filters.push({ term: { "sponsorOrgUnit.name": institution } });
  }

  try {
    const response = await client.search({
      index,
      size: 0,
      track_total_hits: false,
      query: { bool: { filter: filters } },
      aggs: {
        byTitle: {
          terms: {
            field: "title",
            size: TITLE_SIZE,
            order: { _count: "desc" },
          },
          aggs: {
            conferences: { cardinality: { field: "conference.id" } },
            journals: { cardinality: { field: "journal.id" } },
            authors: { cardinality: { field: "author.id" } },
            sponsors: { cardinality: { field: "sponsorOrgUnit.id" } },
          },
        },
      },
    });

    const buckets =
      ((response.aggregations as any)?.byTitle?.buckets as any[]) ?? [];

    return res.status(200).json({
      items: buckets.map((bucket, index) => ({
        rank: index + 1,
        title: String(bucket.key_as_string ?? bucket.key),
        publications: bucket.doc_count,
        conferences: bucket.conferences?.value ?? 0,
        journals: bucket.journals?.value ?? 0,
        authors: bucket.authors?.value ?? 0,
        sponsors: bucket.sponsors?.value ?? 0,
      })),
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Falha ao carregar o painel." });
  }
}
