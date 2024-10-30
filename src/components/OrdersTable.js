import React, { useState, useMemo } from 'react';

export default function OrdersTable({ titles, data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrar los datos basados en el término de búsqueda
    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter((order) => {
            return (
                order.Date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.Id.toString().includes(searchTerm) ||
                order.Type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.Company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.Price.toString().includes(searchTerm) ||
                order.Observation.toLowerCase().includes(searchTerm.toLowerCase())
            );
        });
    }, [data, searchTerm]);

    const totalPages = useMemo(() => Math.ceil(filteredData.length / itemsPerPage), [filteredData.length, itemsPerPage]);

    const paginatedData = useMemo(
        () => filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [filteredData, currentPage, itemsPerPage]
    );

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl overflow-hidden">


            <div className="overflow-x-auto rounded-b-lg">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-gray-700 transition duration-200">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            {titles?.map(({ name }) => (
                                <th key={name} className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900 dark:text-white">
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData?.map(({ Id, Date, Type, Company, Price, Observation }) => (
                            <tr key={Id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200">
                                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{Date}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{Id}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{Type}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{Company}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{Price}</td>
                                <td className="whitespace-nowrap px-4 py-3 text-gray-900 dark:text-white">{Observation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                {/* Paginador con anterior/siguiente y página/total */}
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        <span className="sr-only">Prev Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <p className="text-xs text-gray-900 dark:text-white">
                        {currentPage}
                        <span className="mx-0.25">/</span>
                        {totalPages}
                    </p>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                        <span className="sr-only">Next Page</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <div className=" flex flex-col">
                    <div className="relative ">
                        <svg
                            className="absolute top-3 left-3 w-5 h-5 text-gray-400 dark:text-gray-300"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a7 7 0 00-7 7 7 7 0 1014 0 7 7 0 00-7-7zM11 2a9 9 0 00-9 9 9 9 0 0015.74 5.75l4.74 4.74 1.41-1.41-4.74-4.74A9 9 0 0011 2z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 transition duration-200"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Items por página:</span>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value, 10));
                            setCurrentPage(1);
                        }}
                        className="block w-16 rounded-lg border border-gray-300 bg-white p-1 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
