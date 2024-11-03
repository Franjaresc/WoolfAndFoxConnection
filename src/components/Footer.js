import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '@/assets/images/Logo.png'

export default function Footer() {
    return (
        <footer className="bg-background">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center text-primary-600 sm:justify-start dark:text-primary-600">
                        <Link className="block text-primary-600 dark:text-primary-600 flex " href="#">
                            <Image
                                src={Logo}
                                width={100}
                                height={100}
                                alt='Woolf and Fox connection'
                            />
                        </Link>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-500 lg:mt-0 lg:text-right dark:text-gray-400">
                        Copyright &copy; 2022. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
