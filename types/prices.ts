export type SourcePrice = { data: { id: string; price: { previous: number; current: number } } };

export type PricesSet = {
  states: SourcePrice[];
};
