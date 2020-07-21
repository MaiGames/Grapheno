export interface IHash {

    [details: string]: any

}

declare global {

    module NodeJS {

        export interface Global {

            [details: string]: any

        }

   }

}