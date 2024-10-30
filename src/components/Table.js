import Link from 'next/link'
import React from 'react'

export default function Table({ titles, data }) {

    return (

        <div className="rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto rounded-t-lg">
                <table
                    className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm dark:divide-gray-700 dark:bg-gray-900"
                >
                    <thead className="ltr:text-left rtl:text-right">
                        <tr>
                            {titles?.map(title => (

                                <th key={title.name} className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                    {title.name}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {
                            data?.map(
                                order => (
                                    <tr key={order.Id}>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {order.Date}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {order.Id}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {order.Type}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {order.Company}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {order.Price}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900 dark:text-white">
                                            {order.Observation}
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

            <div className="rounded-b-lg border-t border-gray-200 px-4 py-2 dark:border-gray-700">
                <ol className="flex justify-end gap-1 text-xs font-medium">
                    <li>
                        <a
                            href="#"
                            className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >
                            <span className="sr-only">Prev Page</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >
                            1
                        </a>
                    </li>

                    <li
                        className="block size-8 rounded border-blue-600 bg-blue-600 text-center leading-8 dark:text-white"
                    >
                        2
                    </li>

                    <li>
                        <a
                            href="#"
                            className="block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >
                            3
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="block size-8 rounded border border-gray-100 bg-white text-center leading-8 text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >
                            4
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            className="inline-flex size-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >
                            <span className="sr-only">Next Page</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </a>
                    </li>
                </ol>
            </div>
        </div>
    )
}
