import HomePage from "@/pages/Home/HomePage";
import AdminPage from "@/pages/Admin/AdminPage";
import CarInfo from "@/pages/Admin/CarInfo";

export const RouterData = [
  {
    title: "Home",
    element: <HomePage />,
    link: "/",
  },
  {
    title: "Admin",
    element: <AdminPage />,
    link: "/admin",
  },
  {
    title: "CarInfo",
    element: <CarInfo />,
    link: "/admin/carInfo/:carId",
  },
];
