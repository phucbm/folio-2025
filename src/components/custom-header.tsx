import React from 'react';
import {Logo} from "@/components/logo";
import {MenuBar} from "@/components/menu-bar";
import {getPageMap} from "nextra/page-map";

const CustomHeader = async () => {
    return (
        <div className="custom-header flex items-center justify-between py-3 mb-24">
            <Logo/>

            <MenuBar pageMap={await getPageMap()}/>
        </div>
    );
};

export default CustomHeader;