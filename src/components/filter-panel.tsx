import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"

type FilterPanelProps = {
    setListChecked: Dispatch<SetStateAction<boolean[]>>
}

export const FilterPanel = (props:FilterPanelProps) => {

    const initItems = [
        {title: "без пересадок", checked: true},
        {title: "1 пересадка", checked: true},
        {title: "2 пересадки", checked: true},
        {title: "3 пересадки", checked: true},
    ]

    const {setListChecked} = props;

    const [items, setItems] = useState(initItems)

    useEffect(() => {
        setListChecked(items.map( (item) => item.checked))
    }, [items, setListChecked])

    const handelChange = (idx:number) => {
        let newItem = items.slice(0);
        newItem[idx].checked = !newItem[idx].checked;
        setItems(newItem)
    }

    const setAllChecked = (e:ChangeEvent<HTMLInputElement>) => {
        setItems(items.map( (item) => ({title:item.title, checked: e.target.checked})))
    }

    return (
        <div className="filter-panel">
            <span className="filter-panel__title">количество пересадок</span>
            <div className="filter-panel__item" key={-1}>
                <input id="cb-1" className="filter-panel__item-checkbox" type="checkbox" defaultChecked={true} onChange={(e) => setAllChecked(e)}/>
                <label htmlFor="cb-1">Всё</label>
            </div>
            {
                items.map( (item, idx) =>(
                <div className="filter-panel__item" key={idx}>
                    <input id={"cb" + idx} className="filter-panel__item-checkbox" type="checkbox" checked={item.checked} onChange={() => handelChange(idx)}/>
                    <label htmlFor={"cb" + idx}>{item.title}</label>
                </div>
                ))
            }
        </div>
    )
}