import { Link } from "react-router";

function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto py-4 px-4 md:px-6 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-bold">
          Ruairí's Site
        </Link>
      </div>
    </header>
  );
}

export default Header;
