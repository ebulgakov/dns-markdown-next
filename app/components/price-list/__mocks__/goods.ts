import type { Goods, Position, PriceList } from "@/types/pricelist";

export const mockGoodsList: Goods[] = [
  {
    _id: "g1",
    code: "123",
    title: "Ноутбук Apple MacBook Air",
    price: "9999",
    link: "#",
    description:
      "[2G, 3G, 4G, ремешок - черный, Android 4.0 и выше, iOS 10 и выше, камера, GPS, LBS, Wi-Fi, IP67]",
    reasons: [
      { _id: "r1", label: "Тип товара:", text: "б/у" },
      { _id: "r2", label: "Внешний вид:", text: "потертости, царапины" },
      { _id: "r3", label: "Комплектация:", text: "неполный комплект" },
      { _id: "r3", label: "Тип ремонта:", text: "замена детали устройства" }
    ],
    priceOld: "19999",
    profit: "10000",
    image: "https://placehold.co/400",
    available: "В наличии"
  },
  {
    _id: "g3",
    code: "125",
    title: "Смартфон Samsung Galaxy S23",
    price: "79999",
    link: "#",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "https://placehold.co/400",
    available: "В наличии"
  },
  {
    _id: "g1",
    code: "123",
    title: "Ноутбук Apple MacBook Air",
    price: "99999",
    link: "#",
    description: "",
    reasons: [],
    priceOld: "",
    profit: "",
    image: "https://placehold.co/400",
    available: "В наличии"
  }
];

export const mockPositions: Position[] = [
  {
    _id: "1",
    title: "Ноутбуки",
    items: [
      {
        _id: "g1",
        code: "123",
        title: "Ноутбук Apple MacBook Air",
        price: "9999",
        link: "#",
        description: "",
        reasons: [],
        priceOld: "19999",
        profit: "10000",
        image: "https://placehold.co/400",
        available: "В наличии"
      }
    ]
  },
  {
    _id: "2",
    title: "Смартфоны",
    items: [
      {
        _id: "g3",
        code: "125",
        title: "Смартфон Samsung Galaxy S23",
        price: "79999",
        link: "#",
        description: "",
        reasons: [],
        priceOld: "",
        profit: "",
        image: "https://placehold.co/400",
        available: "В наличии"
      }
    ]
  }
];

export const mockPriceList: PriceList = {
  _id: "1",
  positions: mockPositions,
  city: "TestCity",
  createdAt: `2024-01-01T00:00:00.000Z`
};

export const mockDiff = {
  priceOld: "99999",
  price: "89999",
  profit: "10000"
};
