export type Author = {
  id: string;
  name: string;
  idLattes?: string;
  nationality?: string;
};
export type OrgUnit = {
  id: string;
  name: string;
};

export type Service = {
  id: string;
  title: string[];
};

export type IndicatorType = {
  key: string;
  doc_count: number;
};

export type MemberType = {
  name: string;
  image: string;
  lattes: string;
};
