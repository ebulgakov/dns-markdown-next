import type { AnalysisData } from "@/types/analysis-data";

export const mockAnalysisData: AnalysisData[] = [
  {
    _id: "1",
    code: "001",
    title: "Product A",
    price: "100",
    dateAdded: new Date("2023-01-01").toISOString(),
    link: "/product-a",
    city: "TestCity",
    available: "true",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    category: "test"
  },
  {
    _id: "2",
    code: "002",
    title: "Product B",
    price: "200",
    dateAdded: new Date("2023-01-03").toISOString(),
    link: "/product-b",
    city: "TestCity",
    available: "true",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    category: "test"
  },
  {
    _id: "3",
    code: "003",
    title: "Product C",
    price: "150",
    dateAdded: new Date("2023-01-02").toISOString(),
    link: "/product-c",
    city: "TestCity",
    available: "false",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    category: "NonTest"
  }
];
