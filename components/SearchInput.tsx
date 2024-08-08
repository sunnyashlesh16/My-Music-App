"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";

import Input from "./Input";

const SearchInput = () => {

    const router = useRouter();
    const [value, setValue] = useState<string>("");
    const debouncdValue = useDebounce<string>(value, 500);

    useEffect(( ) => {
        const query = {
            title: debouncdValue,
        }

        const url = qs.stringifyUrl({
            url:'/search',
            query: query
        });

        router.push(url);
    }, [debouncdValue, router]);

    return (
        <Input placeholder="what do you want" value={value} onChange={(e) => setValue(e.target.value)}/>
    )
}

export default SearchInput;