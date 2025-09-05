import { useState } from "react";
import "./App.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>open</button>
      <Modal isOpen={isOpen}>
        <h2>title</h2>
        <p>text</p>
        <button onClick={() => setIsOpen(false)}>close</button>
      </Modal>
    </div>
  );
}

export default App;
