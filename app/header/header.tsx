import { Link } from "@remix-run/react";

function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">
      Ruairí's Site
        </Link>        
      </div>
    </header>
  );
}

export default Header;
