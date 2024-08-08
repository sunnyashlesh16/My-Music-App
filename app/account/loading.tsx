"use client";

import Box from "@/components/Box";
import { BounceLoader } from "react-spinners";

const Loading = () => {
    return (
        <Box className="h-full flex items-center justify-center">
            <BounceLoader color ="#22c55e" size={40}/>
            <div className=" text-neutral-400">
                Just Few Moments........
            </div>
        </Box>
    )
}


export default Loading;