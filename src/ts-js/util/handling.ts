import { IHash } from "../interfaces"

export enum HandleCallMode { AllHandlerCall, SingleHandlerCall }

export interface IChildParamsHash {

    [handlerChildName: string]: IHash

}

interface IHandlerChilds {

    [name: string]: IHandlerChild

}

export interface IHandlerChild {

    parent: HandlerParent

    init(): any

    /**
     * This is where all the handler magic occours
     */
    handle(params: IHash, mode: HandleCallMode): any

}

export class HandlerParent {

    handlerChilds: IHandlerChilds = {}

    addHandlerChild(name: string, child: IHandlerChild) {

        child.parent = this
        child.init()

        this.handlerChilds[name] = child

    }

    removeHandlerChild(name: string) {

        this.handlerChilds[name] = undefined

    }

    handleAll(handlersParams: IChildParamsHash): IHash {

        const hash: IHash = {}

        for(let [name, child] of Object.entries(this.handlerChilds)) {

            child.parent = this

            hash[name] = child.handle(handlersParams[name], HandleCallMode.AllHandlerCall)

        }

        return hash

    }

    handleSingle(name: string, params: IHash): any {

        return this.getHandlerChild(name).handle(params, HandleCallMode.SingleHandlerCall)

    }

    getHandlerChild(name: string): IHandlerChild { 
        
        const handler = this.handlerChilds[name]

        if(handler == null) return null

        handler.parent = this

        return handler

    }

}