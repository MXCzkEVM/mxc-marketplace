


import { instanceMep1002Name, CONTRACTS_MAP } from './Address'
import { provider } from './Network'
import localforage from 'localforage'

const mep1002NameEvent = async () => {
    let namesTokensBlock: number = await localforage.getItem('namesTokens__blocksNum') || CONTRACTS_MAP.MEP1002NameStartBlock
    let mep1002Name = await instanceMep1002Name()
    let latestBlock = await provider.getBlockNumber();
    const eventFilter = mep1002Name.filters.Transfer()
    let events: any = await mep1002Name.queryFilter(
        eventFilter,
        namesTokensBlock,
        latestBlock
    )
    events = events.map((item: any) => {
        let { to, tokenId: { _hex } } = item.args
        return {
            to,
            token_id: _hex
        }
    })
    let namesTokens: any = await localforage.getItem('namesTokens') || []
    let newEvents = namesTokens.concat(events)
    await localforage.setItem('namesTokens__blocksNum', latestBlock)
    await localforage.setItem('namesTokens', newEvents)

    return newEvents
}

export const getHexagon = async () => {
    let events = await mep1002NameEvent()
    let hexagons = Object.values(events.reduce((acc: any, event: any) => {
        acc[event.token_id] = {
            tokenId: event.token_id,
            owner: event.to
        };
        return acc;
    }, {}));
    return hexagons;
}

export const getHexagonWithAddress = async (address: any) => {
    let hexagons = await getHexagon()
    hexagons = hexagons.filter((item: any) => item.owner == address)
    return hexagons;
}