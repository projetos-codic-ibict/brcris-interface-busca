class APIConnector {
  onResultClick() {
    // optional. Called when a result has been clicked
  }
  onAutocompleteResultClick() {
    // optional. Called when an autocomplete result has been clicked
  }

  async onSearch(requestState: any, queryConfig: any) {
    const { searchTerm } = requestState;
    if (!searchTerm) return requestState; // evita busca vazia
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestState,
        queryConfig,
      }),
    });
    return response.json();
  }

  async onAutocomplete(requestState: any, queryConfig: any) {
    queryConfig.index = queryConfig.results.index;
    const response = await fetch('/api/autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestState,
        queryConfig,
      }),
    });
    return response.json();
  }
}

export default APIConnector;
