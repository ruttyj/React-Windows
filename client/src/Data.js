let topId = 0;
const products = [
  {
    id: ++topId,
    description: `Blue flower ${topId}`,
    image_url: `/assets/blue-flower.png`,
    title: "Something Flower",
    price: topId * 2.99,
    rating: 4.5,
  },
  {
    id: ++topId,
    description: `Orange flower ${topId}`,
    image_url: `/assets/orange-flower.png`,
    title: "Something Flower",
    price: topId * 2.99,
    rating: 4.5,
  },
  {
    id: ++topId,
    description: `Pink flower ${topId}`,
    image_url: `/assets/pink-flower.png`,
    title: "Something Flower",
    price: topId * 2.99,
    rating: 4.5,
  },
];

export default products;
