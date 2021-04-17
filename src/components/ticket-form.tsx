import React from "react"
import { Ticket } from "../services/aviasales-services"

type TicketFormProps = {
    ticket: Ticket
}

export const TicketForm = (props:TicketFormProps) => {
    const {ticket} = props;

    const getDuration = (mins:number) => {
        const hours = Math.trunc(mins/60);
        const minutes = mins % 60;
        return `${hours}ч ${minutes}м`;
    }

    const getTimes = (s:string, dur: number) => {
        const date_start = new Date(s);
        const date_end = new Date(date_start.valueOf() + dur * 60 * 1000);

        const s_start = date_start.toTimeString().slice(0, 5);
        const s_end = date_end.toTimeString().slice(0, 5);

        return `${s_start} - ${s_end}`;
    }

    const getTransferTitle = (len:number) => {
        //len < 10
        switch (len) {
            case 0:
                return `Без пересадок`
            case 1:
                return `${len} пересадка`
            case 2:
            case 3:
            case 4:
                return `${len} пересадки`
            default:
                return `${len} пересадок`
        }
    }

    return (
    <div className="ticket-form">
        <div className="line">
            <span className="ticket-form__price">{ticket.price.toLocaleString("RU")} Р</span>
            <img className="ticket-form__img" src={`//pics.avs.io/99/36/${ticket.carrier}.png`} alt="carrier"/>
        </div>
        {
            ticket.segments.map( (segm,idx) => (
                <div key={idx} className="line">
                    <div className="ticket-form__semgent">
                        <span className="ticket-form__semgent-title">{`${segm.origin}-${segm.destination}`}</span>
                        <span className="ticket-form__semgent-value">{getTimes(segm.date, segm.duration)}</span>
                    </div>
                    <div className="ticket-form__semgent">
                        <span className="ticket-form__semgent-title">В пути</span>
                        <span className="ticket-form__semgent-value">{getDuration(segm.duration)}</span>
                    </div>
                    <div className="ticket-form__semgent">
                        <span className="ticket-form__semgent-title">{getTransferTitle(segm.stops.length)}</span>
                        <span className="ticket-form__semgent-value">{segm.stops.join(", ")}</span>
                    </div>
                </div>
            ))
        }
    </div>
    )
}