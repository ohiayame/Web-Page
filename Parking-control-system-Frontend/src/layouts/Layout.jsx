import Header from "@/layouts/Header";

function Layout({ navUrl, val, children }) {

  return (
    <div
      style={{
        backgroundColor: "#eaf1fdff",
        padding: "3px",
        minHeight: "1074px",
      }}
    >
      {/* 페이지 이동 버튼 */}
      <Header navUrl={navUrl} val={val} />

      <main>{children}</main>
    </div>
  );
}

export default Layout;
