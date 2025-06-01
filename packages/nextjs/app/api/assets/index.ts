export default function handler(req, res) {
  res.status(200).json({
    assets: [
      {
        id: 1,
        name: "BMW 530d",
        category: "Cars",
        description: "White BMW, 2016, 135,000km, VIN VXKUPHNSSM4206445",
        owner: "0xAliceAddress",
        estimatedValue: 25000,
      },
      {
        id: 2,
        name: "Luxury Villa",
        category: "Real Estate",
        description: "5-bedroom villa in Marbella, built 2019, 400sqm",
        owner: "0xBobAddress",
        estimatedValue: 1200000,
      },
      {
        id: 3,
        name: "Rolex Daytona",
        category: "Luxury Items",
        description: "Rolex Daytona, 2021, steel/gold, full set",
        owner: "0xCarolAddress",
        estimatedValue: 35000,
      },
      {
        id: 4,
        name: "Tesla Model 3",
        category: "Cars",
        description: "Tesla Model 3, 2022, 10,000km, VIN 5YJ3E1EA7KF317000",
        owner: "0xBobAddress",
        estimatedValue: 42000,
      },
      {
        id: 5,
        name: "Penthouse Berlin",
        category: "Real Estate",
        description: "Penthouse, 3 rooms, 150sqm, built 2018",
        owner: "0xAliceAddress",
        estimatedValue: 950000,
      },
      {
        id: 6,
        name: "Hermès Birkin",
        category: "Luxury Items",
        description: "Hermès Birkin 30, Togo leather, gold hardware",
        owner: "0xCarolAddress",
        estimatedValue: 18000,
      },
    ],
  });
} 