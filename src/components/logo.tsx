import React from 'react';
import {Link} from 'next-view-transitions';

export function Logo({hasLink = true, title = "Go to home"}) {
    return (
        <>
            {hasLink &&
                <Link href="/" title={title} className="no-underline inline-flex gap-1 items-center text-2xl hover:bg-gray-100">
                    <LogoIcon/>
                    {/*<span>Phúc Bùi</span>*/}
                </Link>}

            {!hasLink && <LogoIcon/>}
        </>
    );
}


export function LogoIcon() {
    return (
        <>
            <style>{`
        .pixelart-to-css {
          animation: x 1s infinite;
        }

        @keyframes x {
          0%, 50% {
            box-shadow: 5px 5px 0 0 var(--bg), 10px 5px 0 0 var(--bg), 15px 5px 0 0 var(--bg), 20px 5px 0 0 var(--bg), 25px 5px 0 0 var(--bg), 30px 5px 0 0 var(--bg), 35px 5px 0 0 var(--bg), 5px 10px 0 0 var(--bg), 10px 10px 0 0 rgba(0, 0, 0, 1), 15px 10px 0 0 rgba(0, 0, 0, 1), 20px 10px 0 0 rgba(0, 0, 0, 1), 25px 10px 0 0 var(--bg), 30px 10px 0 0 var(--bg), 35px 10px 0 0 var(--bg), 5px 15px 0 0 var(--bg), 10px 15px 0 0 rgba(0, 0, 0, 1), 15px 15px 0 0 var(--bg), 20px 15px 0 0 rgba(0, 0, 0, 1), 25px 15px 0 0 var(--bg), 30px 15px 0 0 var(--bg), 35px 15px 0 0 var(--bg), 5px 20px 0 0 var(--bg), 10px 20px 0 0 rgba(0, 0, 0, 1), 15px 20px 0 0 rgba(0, 0, 0, 1), 20px 20px 0 0 rgba(0, 0, 0, 1), 25px 20px 0 0 var(--bg), 30px 20px 0 0 var(--bg), 35px 20px 0 0 var(--bg), 5px 25px 0 0 var(--bg), 10px 25px 0 0 rgba(0, 0, 0, 1), 15px 25px 0 0 var(--bg), 20px 25px 0 0 var(--bg), 25px 25px 0 0 var(--bg), 30px 25px 0 0 var(--bg), 35px 25px 0 0 var(--bg), 5px 30px 0 0 var(--bg), 10px 30px 0 0 rgba(0, 0, 0, 1), 15px 30px 0 0 var(--bg), 20px 30px 0 0 var(--bg), 25px 30px 0 0 rgba(0, 0, 0, 1), 30px 30px 0 0 rgba(0, 0, 0, 1), 35px 30px 0 0 var(--bg), 5px 35px 0 0 var(--bg), 10px 35px 0 0 var(--bg), 15px 35px 0 0 var(--bg), 20px 35px 0 0 var(--bg), 25px 35px 0 0 var(--bg), 30px 35px 0 0 var(--bg), 35px 35px 0 0 var(--bg);
            height: 5px; width: 5px;
          }

          50.01%, 100% {
            box-shadow: 5px 5px 0 0 var(--bg), 10px 5px 0 0 var(--bg), 15px 5px 0 0 var(--bg), 20px 5px 0 0 var(--bg), 25px 5px 0 0 var(--bg), 30px 5px 0 0 var(--bg), 35px 5px 0 0 var(--bg), 5px 10px 0 0 var(--bg), 10px 10px 0 0 rgba(0, 0, 0, 1), 15px 10px 0 0 rgba(0, 0, 0, 1), 20px 10px 0 0 rgba(0, 0, 0, 1), 25px 10px 0 0 var(--bg), 30px 10px 0 0 var(--bg), 35px 10px 0 0 var(--bg), 5px 15px 0 0 var(--bg), 10px 15px 0 0 rgba(0, 0, 0, 1), 15px 15px 0 0 var(--bg), 20px 15px 0 0 rgba(0, 0, 0, 1), 25px 15px 0 0 var(--bg), 30px 15px 0 0 var(--bg), 35px 15px 0 0 var(--bg), 5px 20px 0 0 var(--bg), 10px 20px 0 0 rgba(0, 0, 0, 1), 15px 20px 0 0 rgba(0, 0, 0, 1), 20px 20px 0 0 rgba(0, 0, 0, 1), 25px 20px 0 0 var(--bg), 30px 20px 0 0 var(--bg), 35px 20px 0 0 var(--bg), 5px 25px 0 0 var(--bg), 10px 25px 0 0 rgba(0, 0, 0, 1), 15px 25px 0 0 var(--bg), 20px 25px 0 0 var(--bg), 25px 25px 0 0 var(--bg), 30px 25px 0 0 var(--bg), 35px 25px 0 0 var(--bg), 5px 30px 0 0 var(--bg), 10px 30px 0 0 rgba(0, 0, 0, 1), 15px 30px 0 0 var(--bg), 20px 30px 0 0 var(--bg), 25px 30px 0 0 var(--bg), 30px 30px 0 0 var(--bg), 35px 30px 0 0 var(--bg), 5px 35px 0 0 var(--bg), 10px 35px 0 0 var(--bg), 15px 35px 0 0 var(--bg), 20px 35px 0 0 var(--bg), 25px 35px 0 0 var(--bg), 30px 35px 0 0 var(--bg), 35px 35px 0 0 var(--bg);
            height: 5px; width: 5px;
          }
        }
      `}</style>

            <div className="w-[35px] aspect-square relative [--bg:rgba(0,0,0,0)]">
                <div className="pixelart-to-css absolute top-[-5px] left-[-5px]"/>
            </div>
        </>
    );
}