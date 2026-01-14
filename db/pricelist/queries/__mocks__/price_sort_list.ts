import type { Goods, Position, PriceList } from "@/types/pricelist";

export const mockPriceList: PriceList = {
  city: "TestCity",
  positions: [
    {
      title: "Category 1",
      items: [
        {
          title: "Item 1",
          price: "100",
          code: "C1",
          _id: "",
          link: "",
          description: "",
          reasons: [],
          priceOld: "",
          profit: "",
          image: "",
          available: ""
        },
        {
          title: "Item 2",
          price: "50",
          code: "C2",
          _id: "",
          link: "",
          description: "",
          reasons: [],
          priceOld: "",
          profit: "",
          image: "",
          available: ""
        }
      ],
      _id: ""
    },
    {
      title: "Category 2",
      items: [
        {
          title: "Item 3",
          price: "200",
          code: "C3",
          _id: "",
          link: "",
          description: "",
          reasons: [],
          priceOld: "",
          profit: "",
          image: "",
          available: ""
        },
        {
          title: "Item 4",
          price: "150",
          code: "C4",
          _id: "",
          link: "",
          description: "",
          reasons: [],
          priceOld: "",
          profit: "",
          image: "",
          available: ""
        }
      ],
      _id: ""
    }
  ],
  _id: "",
  createdAt: ""
};

export const brokenPosition: Position = {
  title: "Category 3",
  items: [
    {
      title: "Item 5",
      price: "0",
      code: "C5",
      _id: "",
      link: "",
      description: "",
      reasons: [],
      priceOld: "",
      profit: "",
      image: "",
      available: ""
    },
    {
      title: "Item 6",
      price: "invalid",
      code: "C6",
      _id: "",
      link: "",
      description: "",
      reasons: [],
      priceOld: "",
      profit: "",
      image: "",
      available: ""
    },
    {
      title: "Item 7",
      price: "-100",
      code: "C7",
      _id: "",
      link: "",
      description: "",
      reasons: [],
      priceOld: "",
      profit: "",
      image: "",
      available: ""
    }
  ],
  _id: ""
};

export const sortedByPrice: Goods[] = [
  {
    title: "Item 2",
    price: "50",
    code: "C2",
    _id: "",
    link: "",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    available: ""
  },
  {
    title: "Item 1",
    price: "100",
    code: "C1",
    _id: "",
    link: "",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    available: ""
  },
  {
    title: "Item 4",
    price: "150",
    code: "C4",
    _id: "",
    link: "",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    available: ""
  },
  {
    title: "Item 3",
    price: "200",
    code: "C3",
    _id: "",
    link: "",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "",
    available: ""
  }
];
