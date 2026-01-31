import type { Goods } from "@/types/pricelist";

export const mockGoods: Goods[] = [
  {
    _id: "1",
    city: "Test City",
    link: "http://test.com/product/1",
    title: "",
    description: "",
    reasons: [],
    priceOld: "",
    price: "",
    profit: "",
    code: "",
    image: "",
    available: ""
  },
  {
    _id: "g1",
    title: "Good 1",
    link: "https://www.google.com/",
    description: "",
    reasons: [{ label: "some", text: "reason", _id: "1" }],
    priceOld: "20",
    price: "10",
    profit: "10",
    code: "12345ssq",
    image: "img-url",
    available: "big-mall",
    city: "TestCity"
  },
  {
    _id: "g2",
    title: "Good 2",
    link: "https://www.google.com/",
    description: "",
    reasons: [{ label: "some", text: "reason", _id: "0" }],
    priceOld: "200",
    price: "100",
    profit: "100",
    code: "12345ssq",
    image: "img-url",
    available: "big-mall",
    city: "TestCity"
  }
];
