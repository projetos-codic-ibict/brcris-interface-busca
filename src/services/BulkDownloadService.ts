import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';

class BulkDownloadService {
  async search(index: string, query: QueryDslQueryContainer) {
    const body = JSON.stringify({ query, index });
    const response = await fetch('/api/bulk-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    return response.json();
  }
}
export default BulkDownloadService;
