import type { Goods, Position, PriceList } from "@/types/pricelist";

export const brokenPosition: Position = {
  _id: "3",
  items: [
    {
      _id: "c",
      title: "Item C",
      price: "300",
      priceOld: "350",
      profit: "invalid",
      link: "",
      description: "",
      reasons: [],
      code: "",
      image: "",
      available: ""
    }
  ],
  title: ""
};

export const mockPriceList: PriceList = {
  city: "TestCity",
  positions: [
    {
      _id: "1",
      items: [
        {
          _id: "a",
          title: "Item A",
          price: "100",
          priceOld: "120",
          profit: "20",
          link: "",
          description: "",
          reasons: [],
          code: "",
          image: "",
          available: ""
        },
        {
          _id: "d",
          title: "Item D",
          price: "50",
          priceOld: "60",
          profit: "0",
          link: "",
          description: "",
          reasons: [],
          code: "",
          image: "",
          available: ""
        }
      ],
      title: ""
    },
    {
      _id: "2",
      items: [
        {
          _id: "b",
          title: "Item B",
          price: "200",
          priceOld: "250",
          profit: "50",
          link: "",
          description: "",
          reasons: [],
          code: "",
          image: "",
          available: ""
        }
      ],
      title: ""
    }
  ],
  _id: "",
  createdAt: ""
};

export const sortedByProfit: Goods[] = [
  {
    _id: "b",
    title: "Item B",
    price: "200",
    priceOld: "250",
    profit: "50",
    link: "",
    description: "",
    reasons: [],
    code: "",
    image: "",
    available: ""
  },
  {
    _id: "a",
    title: "Item A",
    price: "100",
    priceOld: "120",
    profit: "20",
    link: "",
    description: "",
    reasons: [],
    code: "",
    image: "",
    available: ""
  },
  {
    _id: "d",
    title: "Item D",
    price: "50",
    priceOld: "60",
    profit: "0",
    link: "",
    description: "",
    reasons: [],
    code: "",
    image: "",
    available: ""
  }
];
