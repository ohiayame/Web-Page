import Header from "./header";
import Footer from "./footer";
import Container from "./container";

export default function Layout({ children }) {
  return (
    <>
      <Header />

      <main>
        <Container>{children}</Container>
      </main>

      <Footer />
    </>
  );
}
