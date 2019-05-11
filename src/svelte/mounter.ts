import { mountable, getOutlets, outletSelector, addClass } from '../mount'

export class SvelteMounter implements mountable {
    constructor(
        public target = document.body,
        public instances: any[] = []
    ) { }

    async push(builder: any) { 
        const container = document.createElement('div')
        addClass(container, outletSelector)
        this.target.appendChild(container)
        const instance = builder(container)
        this.instances.push({
            instance,
            container
        })
    }

    async pop() {
        const { leaving } = getOutlets(outletSelector)
        if (!leaving) {
            return
        }
        const { instance, container } = this.instances[0]
        instance.$destroy()
        this.target.removeChild(container)
        this.instances.shift()        
    }

    createBuilder(Component: any, props: Record<any, any>) {
        return (target: HTMLElement) => {
            return new Component({
                target,
                props: { ...props }
            })
        }        
    }
}