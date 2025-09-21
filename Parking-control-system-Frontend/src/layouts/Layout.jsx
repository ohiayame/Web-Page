import Header from "@/layouts/Header";

function Layout({ navUrl, val, children }) {
  console.log("navUrl");
  return (
    <>
      {/* 페이지 이동 버튼 */}
      <Header navUrl={navUrl} val={val} />

      <main style={{ backgroundColor: "#ffdaf9ff" }}>{children}</main>
    </>
  );
}

export default Layout;
