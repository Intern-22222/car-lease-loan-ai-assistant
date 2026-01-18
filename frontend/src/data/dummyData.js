export const dummyContracts = [
  {
    id: 1,
    carName: "2024 BMW 330i xDrive Sedan",
    fileName: "BMW_Lease_2024.pdf",
    date: "Jan 15, 2026",
    summary: {
      monthly: "$489/month",
      duration: "36 months",
      apr: "4.9% APR",
      mileage: "12,000 miles/year",
      deposit: "$500 (refundable)",
      earlyTermination: "$2,500 + remaining payments",
      excessMileage: "$0.25/mile over limit"
    },
    chatHistory: [
      { sender: "ai", text: "I've analyzed your BMW lease. It looks competitive for luxury vehicles." }
    ]
  },
  {
    id: 2,
    carName: "2024 Tesla Model 3 Long Range",
    fileName: "Tesla_Model3_Lease.pdf",
    date: "Jan 10, 2026",
    summary: {
      monthly: "$550/month",
      duration: "36 months",
      apr: "0.0% APR",
      mileage: "10,000 miles/year",
      deposit: "$0",
      earlyTermination: "Full balance of remaining payments",
      excessMileage: "$0.30/mile over limit"
    },
    chatHistory: [
      { sender: "ai", text: "Tesla leases are straightforward but have strict early termination rules." }
    ]
  }
];