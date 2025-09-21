import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RouterData } from "@/routes/RouterData";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {RouterData.map((route, idx) => (
          <Route key={idx} path={route.link} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
