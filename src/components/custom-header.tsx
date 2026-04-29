import React from 'react';
import {Logo} from "@/components/logo";
import {MenuBar} from "@/components/menu-bar";

const CustomHeader = async () => {
    return (
        <div className="custom-header flex items-center justify-between py-3 px-1 border-b-2 border-foreground">
            <Logo/>

            <MenuBar/>
        </div>
    );
};

export default CustomHeader;