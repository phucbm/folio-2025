import React from 'react';
import {Link} from "next-view-transitions";

const CustomHeader = async () => {
    return (
        <div className="custom-header flex items-center justify-between lg:py-24 py-12">
            <div className="">
                <Link href='/' className="heading-2 no-underline hover:underline">Phuc Bui (Felix)</Link>
                <div>Creative Frontend Engineer</div>
            </div>
        </div>
    );
};

export default CustomHeader;