import React, { useState, useMemo } from 'react';

export default function Table({ titles, data }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const totalPages = useMemo(() => Math.ceil(data?.length / itemsPerPage), [data?.length, itemsPerPage]);

    const paginatedData = useMemo(
        () => data?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
        [data, currentPage, itemsPerPage]
    );

    const getPageNumbers = () => {
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = startPage + maxVisiblePages - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
            <div className="overflow-x-auto rounded-t-lg">
                <table className="min-w-full divide-y-2 divide-gray-200 text-sm dark:divide-gray-700">
                    <thead>
                        <tr>
                            {titles?.map(({ name }) => (
                                <th key={name} className="whitespace-nowrap px-4 py-2 font-semibold text-gray-900 dark:text-white">
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {paginatedData?.map(({ Id, Date, Type, Company, Price, Observation }) => (
                            <tr key={Id}>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{Date}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{Id}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{Type}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{Company}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{Price}</td>
                                <td className="whitespace-nowrap px-4 py-2 text-gray-900 dark:text-white">{Observation}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 dark:border-gray-700">
                {/* Selector de elementos por página */}
                <div className="flex items-center">
                    <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
                        Mostrar:
                    </label>
                    <select
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => {
                            setItemsPerPage(parseInt(e.target.value, 10));
                            setCurrentPage(1);
                        }}
                        className="block w-16 rounded border border-gray-300 bg-white p-1 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                    >
                        {[5, 10, 20, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Paginador dinámico */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => handlePageChange(1)}
                        className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                        disabled={currentPage === 1}
                    >
                        {'<<'}
                    </button>

                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`px-2 py-1 rounded ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                        disabled={currentPage === 1}
                    >
                        {'<'}
                    </button>

                    {getPageNumbers().map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                        disabled={currentPage === totalPages}
                    >
                        {'>'}
                    </button>

                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-2 py-1 rounded ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                        disabled={currentPage === totalPages}
                    >
                        {'>>'}
                    </button>
                </div>
            </div>
        </div>
    );
}

