import { Link } from "react-router-dom";

export default function Header({ navUrl, val }) {
  console.log(navUrl);
  return (
    <div>
      <Link to={navUrl}>
        <button>{val}</button>
      </Link>
    </div>
  );
}
