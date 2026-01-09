import { Outlet, useLocation } from "react-router-dom";

export default function RootLayout() {
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith("/pokemon/");

  return (
    <>
      <Outlet />
    </>
  );
}
