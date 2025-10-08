import api from "./Cliant";

export const getCarData = () => {
const mockData = [
  {
    id: 1,
    status: "입차",
    number: "1234",
    area: "C3",
    entryAt: "2025-10-08T09:12:00",
    exitAt: "",
  },
  {
    id: 2,
    status: "주차중",
    number: "5678",
    area: "B2",
    entryAt: "2025-10-08T08:45:00",
    exitAt: "",
  },
  {
    id: 3,
    status: "주차중",
    number: "8765",
    area: "A1",
    entryAt: "2025-10-08T07:30:00",
    exitAt: "",
  },
  {
    id: 4,
    status: "주차중",
    number: "1234",
    area: "C3",
    entryAt: "2025-10-08T10:10:00",
    exitAt: "",
  },
  {
    id: 5,
    status: "출차",
    number: "1357",
    area: "D4",
    entryAt: "2025-10-07T21:15:00",
    exitAt: "2025-10-08T06:00:00",
  },
  {
    id: 6,
    status: "출차",
    number: "2468",
    area: "C1",
    entryAt: "2025-10-07T20:10:00",
    exitAt: "2025-10-08T05:40:00",
  },
    ];


    return mockData;
}