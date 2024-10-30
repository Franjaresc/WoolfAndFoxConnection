// components/Loader.js
export default function Loader() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary-600"></div>
        <p className="text-gray-500 mt-4">Cargando datos...</p>
      </div>
    );
  }
  