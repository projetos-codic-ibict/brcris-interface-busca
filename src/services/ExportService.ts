import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

class ExportService {
  async search(
    index: string,
    query: QueryDslQueryContainer,
    totalResults: number,
    indexName: string,
    email?: string,
    captcha?: string
  ) {
    const body = JSON.stringify({ query, index, totalResults, indexName, email, captcha });
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    return response;
  }
}
export default ExportService;
