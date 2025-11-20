import {ThemeSwitch} from "nextra-theme-blog";
import {getPageMap} from "nextra/page-map";
import {Navbar} from "@/components/navbar";
import React from "react";
import {Gap} from "@/components/gap";

const CustomFooter = async () => {
    return (
        <div className="custom-footer py-2 px-1">
            <div className="space-y-2">

                {/*row*/}
                <div className="flex justify-between items-center gap-4">

                    {/*col*/}
                    <div className="flex gap-2 items-center w-full">
                        <Navbar pageMap={await getPageMap()}/>
                    </div>

                </div>

                {/*row*/}
                <div className="flex gap-2 items-center">
                    <div>
                        © {new Date().getFullYear()} Felix
                    </div>
                    <ThemeSwitch/>
                </div>

            </div>
        </div>
    );
};

export default CustomFooter;