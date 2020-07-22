interface IKeys {

    [keyCode: number]: string

}

export class KeyboardInput {

    keysDown: IKeys = {}

    constructor(element: HTMLElement) {

        element.addEventListener("keydown", (event) => {

            this.keysDown[event.keyCode] = event.key

        });
        
        //document.body.addEventListener("keypress", (event) => {
            // handle keypress
        //});
        
        element.addEventListener("keyup", (event) => {
            
            this.keysDown[event.keyCode] = undefined

        });

    }

    isKeyCodeDown(keyCode: number): boolean {

        return this.keysDown[keyCode] != null

    }

    isKeyDown(key: string): boolean {

        for(let value of Object.values(this.keysDown)) {

            if(value == key) return true

        }

        return false

    }

}