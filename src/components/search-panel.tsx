import React, { useEffect, useState } from "react"

type SearchPanelProps = {
    setSearchFunc: (n:number) => void
}

export const SearchPanel = (props:SearchPanelProps) => {

    const {setSearchFunc} = props;

    const [select, setSelect] = useState<number>(0)

    useEffect(() => {
        setSearchFunc(select)
    }, [select])

    return (
        <div className="search-panel">
            <button className={`search-panel__button ${select === 0 && "button-active"}`} onClick={() => setSelect(0)}>самый дешевый</button>
            <button className={`search-panel__button ${select === 1 && "button-active"}`}  onClick={() => setSelect(1)}>самый быстрый</button>
            <button className={`search-panel__button ${select === 2 && "button-active"}`}  onClick={() => setSelect(2)}>оптимальный</button>
        </div>
    )
}