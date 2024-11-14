// components/Loader.js
export default function Loader() {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-primary"></div>
        <p className="text-foreground mt-4">Cargando datos...</p>
      </div>
    );
  }
  