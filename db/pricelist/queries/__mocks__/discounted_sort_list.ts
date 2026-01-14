import type { PriceList, Goods, Position } from "@/types/pricelist";

export const mockPriceList: PriceList = {
  _id: "1",
  city: "TestCity",
  positions: [
    {
      title: "Category 1",
      items: [
        {
          _id: "1",
          title: "Good 1",
          price: "100",
          priceOld: "200",
          link: "/good1",
          image: "/img1.jpg",
          description: "",
          reasons: [],
          profit: "",
          code: "",
          available: ""
        },
        {
          _id: "2",
          title: "Good 2",
          price: "150",
          priceOld: "250",
          link: "/good2",
          image: "/img2.jpg",
          description: "",
          reasons: [],
          profit: "",
          code: "",
          available: ""
        }
      ],
      _id: ""
    },
    {
      title: "Category 2",
      items: [
        {
          _id: "3",
          title: "Good 3",
          price: "50",
          priceOld: "100",
          link: "/good3",
          image: "/img3.jpg",
          description: "",
          reasons: [],
          profit: "",
          code: "",
          available: ""
        }
      ],
      _id: ""
    }
  ],
  createdAt: ""
};

export const sortedByDiscount: Goods[] = [
  {
    _id: "1",
    title: "Good 1",
    price: "100",
    priceOld: "200",
    link: "/good1",
    image: "/img1.jpg",
    description: "",
    reasons: [],
    profit: "",
    code: "",
    available: ""
  },
  {
    _id: "3",
    title: "Good 3",
    price: "50",
    priceOld: "100",
    link: "/good3",
    image: "/img3.jpg",
    description: "",
    reasons: [],
    profit: "",
    code: "",
    available: ""
  },
  {
    _id: "2",
    title: "Good 2",
    price: "150",
    priceOld: "250",
    link: "/good2",
    image: "/img2.jpg",
    description: "",
    reasons: [],
    profit: "",
    code: "",
    available: ""
  }
];

export const brokenPosition: Position = {
  title: "Category 3",
  items: [
    {
      _id: "4",
      title: "Good 4",
      price: "200",
      priceOld: "0",
      link: "/good4",
      image: "/img4.jpg",
      description: "",
      reasons: [],
      profit: "",
      code: "",
      available: ""
    }
  ],
  _id: ""
};
