import React, { useEffect, useState } from "react";
import AviasalesService, { Ticket } from "../services/aviasales-services"
import { TicketForm } from "./ticket-form";
import { SearchPanel } from "./search-panel";
import { FilterPanel } from "./filter-panel";

import "./style.scss";

import logo from "./logo.png"



type SearchFunc = (t1: Ticket, t2: Ticket) => number

export const App: React.FC = () => {

    const searchCheap:SearchFunc = (t1,t2) => {
        return t1.price > t2.price ? 1 : t1.price < t2.price ? -1 : 0;
    }

    const searchFast:SearchFunc = (t1,t2) => {
        const time1 = t1.segments[0].duration + t1.segments[1].duration
        const time2 = t2.segments[0].duration + t2.segments[1].duration
        return time1 > time2 ? 1 : time1 < time2 ? -1 : 0;
    }

    const searchOptim:SearchFunc = (t1,t2) => {
        const cheap = searchCheap(t1,t2)
        const fast = searchFast(t1,t2)
        return (cheap + fast > 0) ? 1 : (cheap + fast < 0) ? -1 : 0;
    }

    const filterTransfer = (t:Ticket) => {
        return listChecked[t.segments[0].stops.length] && listChecked[t.segments[1].stops.length]
    }

    const setSearchFunc = (n: number) => {
        setPage(1)
        switch (n) {
            case 0:
                setSearch(() => searchCheap)
                break;
            case 1:
                setSearch(() => searchFast)
                break;
            case 2:
                setSearch(() => searchOptim)
                break;
            default:
                setSearch(() => searchCheap)
                break;
        }
    }

    const [API] = useState(new AviasalesService());
    const [id, setId] = useState<string>("")
    const [data, setData] = useState<Ticket[]>([])
    const [search, setSearch] = useState<SearchFunc>(() => searchCheap)
    const [listChecked, setListChecked] = useState<boolean[]>([true, true, true, true])
    const [page, setPage] = useState(1)

    useEffect(() => {
       API.getId().then(
            (res) => {setId(res.searchId)}
        ).catch(
            (err) => console.log(err)
        )
    }, [API])

    useEffect( () => {
        console.log(id)
        if (id) {
            API.subscribe(id).then(
                (res) => {setData(res)}
            )
        }
    }, [id, API])

    return (
        <div className="container">
            <img className="img" src={logo} alt="logo"/>
            <div className="content">
                <div className="left">
                    <FilterPanel setListChecked={setListChecked}/>
                </div>
                <div className="right">
                    <SearchPanel setSearchFunc={setSearchFunc}/>
                    {
                        data.filter(filterTransfer).sort(search).slice(0,5 * page).map( (t,idx) => <TicketForm key={idx} ticket={t}/> )
                    }
                    <button onClick={() => setPage(prev => prev+1)} className="next-button">Показать еще 5 билетов</button>
                </div>
            </div>
        </div>
    )
}