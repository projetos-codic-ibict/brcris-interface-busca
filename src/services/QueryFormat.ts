/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
type BoolType = {
  bool: {
    must: any[];
    should: any[];
    must_not: any[];
    minimum_should_match?: number;
  };
};

class QueryFormat {
  private queryBase: BoolType = {
    bool: {
      must: [],
      should: [],
      must_not: [],
    },
  };

  public toElasticsearch(input: string, allFields: string[]) {
    console.log('input', input);
    console.log('allFields', allFields);
    const items = input.split(')');
    items.pop();
    for (let index = 0; index < items.length; index++) {
      const [operator, query] = items[index].split('(');
      if (index == 0) {
        const [field, value] = query.split(':');
        if (field === 'all') {
          allFields.forEach((field) => {
            this.queryBase.bool.should.push({
              match: {
                [field]: value,
              },
            });
          });
        } else {
          //@ts-ignore
          const op = index + 1 < items.length ? items[index + 1].split('(').shift().trim() : 'AND';
          this.fillQuery(op, field, value);
        }
      } else {
        const [field, value] = query.split(':');
        this.fillQuery(operator, field, value);
      }
    }
    if (this.queryBase.bool?.should?.length > 0) {
      this.queryBase.bool.minimum_should_match = 1;
    }
    console.log('this.queryBase', this.queryBase);
    return this.queryBase;
  }

  private fillQuery(operator: string, field: string, value: string) {
    if (operator.trim() === 'AND') {
      this.queryBase.bool.must.push({
        match: {
          [field]: value,
        },
      });
    } else if (operator.trim() === 'OR') {
      this.queryBase.bool.should.push({
        match: {
          [field]: value,
        },
      });
    } else if (operator.trim() === 'AND NOT') {
      this.queryBase.bool.must_not.push({
        match: {
          [field]: value,
        },
      });
    }
  }
}

export default QueryFormat;
