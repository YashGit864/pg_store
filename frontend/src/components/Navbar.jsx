import React, {useState} from 'react';
import {ShoppingBagIcon, ShoppingCartIcon} from "lucide-react";
import {Link, useResolvedPath} from "react-router-dom";
import ThemeSelector from "./ThemeSelector.jsx";
import {useProductStore} from "../store/useProductStore.jsx";

function Navbar() {
    const {pathname} = useResolvedPath();
    const isHomePage = pathname === "/";
    const {products} = useProductStore();
    const countOfProducts = products.length;

    return (
        <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto">
                <div className="navbar px-4 min-h-[4rem] justify-between">
                    {/* LOGO */}
                    <div className="flex-1 lg:flex-none">
                        <Link to="/" className="hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-2">
                                <ShoppingCartIcon className="size-9 text-primary" />
                                <span
                                    className="font-semibold font-mono tracking-widest text-2xl
                                    bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                                >
                                POSGRESTORE
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/*Right section*/}
                    <div className="flex items-center gap-4">
                        <ThemeSelector/>
                        {isHomePage && (
                            <div className='indicator'>
                                <ShoppingBagIcon className='size-5'/>
                                <span className='badge badge-sm badge-primary indicator-item'>{countOfProducts}</span>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;