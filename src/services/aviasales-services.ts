export type Ticket = {
  // Цена в рублях
  price: number
  // Код авиакомпании (iata)
  carrier: string
  // Массив перелётов.
  // В тестовом задании это всегда поиск "туда-обратно" значит состоит из двух элементов
  segments: [
    {
      // Код города (iata)
      origin: string
      // Код города (iata)
      destination: string
      // Дата и время вылета туда
      date: string
      // Массив кодов (iata) городов с пересадками
      stops: string[]
      // Общее время перелёта в минутах
      duration: number
    },
    {
      // Код города (iata)
      origin: string
      // Код города (iata)
      destination: string
      // Дата и время вылета обратно
      date: string
      // Массив кодов (iata) городов с пересадками
      stops: string[]
      // Общее время перелёта в минутах
      duration: number
    }
  ]
}

export type SearchType = {
  searchId: string
}

export default class AviasalesService {

    getId = async () : Promise<SearchType> => {
        const response = await fetch("https://front-test.beta.aviasales.ru/search");

        if (!response.ok) {
            throw new Error(`Ошибка выполения запроса. \n статус: ${response.status}`);
        }

        return await response.json();
    }

    subscribe = async(id:string, data:Array<Ticket> = []) : Promise<Array<Ticket>> => {
        const response = await fetch(`https://front-test.beta.aviasales.ru/tickets?searchId=${id}`);
      
        if (response.status === 502) {
          // Status 502 is a connection timeout error,
          // may happen when the connection was pending for too long,
          // and the remote server or a proxy closed it
          // let's reconnect
          data = data.concat(await this.subscribe(id, data));
        } else if (response.status !== 200) {
          // An error - let's show it
          console.log(response.statusText);
          // Reconnect in one second
          await new Promise(resolve => setTimeout(resolve, 1000));
          data = data.concat(await this.subscribe(id, data));
        } else {
          // Get and show the message
          let message = await response.json();
          data = data.concat(message.tickets)
          // Call subscribe() again to get the next message
          if (message.stop === true) return data;
          data = data.concat(await this.subscribe(id, data));
        }
        return await Array.from(new Set(data))
      }

}