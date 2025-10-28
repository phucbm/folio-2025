import {ThemeSwitch} from "nextra-theme-blog";
import {getPageMap} from "nextra/page-map";
import {Navbar} from "@/components/navbar";
import React from "react";

const CustomFooter = async () => {
    return (
        <div className="custom-footer lg:py-24 py-12">
            <div className="space-y-6">

                {/*row*/}
                <div className="flex justify-between items-center gap-4 max-lg:flex-col">

                    {/*col*/}
                    <div className="flex gap-2 items-center">
                        <Navbar pageMap={await getPageMap()}/>
                    </div>

                    {/*col*/}
                    <div className="flex gap-2 items-center">
                        <div>
                            © {new Date().getFullYear()} Felix
                        </div>
                        <ThemeSwitch/>
                    </div>

                    {/*<Search placeholder="Search posts..."/>*/}

                </div>
            </div>
        </div>
    );
};

export default CustomFooter;