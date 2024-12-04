// "use client"; // Mark this as a client component

// import { useState } from "react";
// import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Icons for profile and hamburger menu

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false); // Track menu state for mobile

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <nav className="bg-white shadow-lg p-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">
//         {/* Profile Icon */}
//         <div className="relative">
//           <button onClick={toggleMenu}>
//             <FaBars className="text-2xl cursor-pointer text-gray-800 hover:text-teal-600" />
//           </button>
//         </div>

//         {/* Hamburger Menu (Mobile Only) */}
//         {isMenuOpen && (
//           <div className="absolute top-16 right-0 bg-white shadow-lg rounded-md p-4 space-y-4 md:hidden">
//             <button
//               className="text-gray-800 hover:text-teal-600"
//               onClick={toggleMenu}
//             >
//               <FaTimes className="text-2xl" />
//             </button>
//             <div className="text-gray-800">Menu Item 1</div>
//             <div className="text-gray-800">Menu Item 2</div>
//             <div className="text-gray-800">Logout</div>
//           </div>
//         )}

//         {/* Profile Icon */}
//         <div className="flex items-center">
//           <FaUserCircle className="text-2xl cursor-pointer text-gray-800 hover:text-teal-600" />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
