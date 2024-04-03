import { Car } from "../test-class";

describe("reactive", () => {

    it.only('test proxy 1', () => {

        const setupState = {
            msg:"hi,mini-vue"
        }
        const proxy = new Proxy(setupState, { 
            get(target,key){
                debugger
            }
        })
        const msg = proxy.msg;
        console.log(msg);
        expect(msg).toBe("hi,mini-vue")
    })

    it.only('test proxy 2 ', () => {
        const setupState:any = {  }
        const proxy = new Proxy(setupState, { 
            get(target,key){
                debugger
            }
        })
                    const msg = proxy.msg;
        console.log(msg);
        expect(msg).toBe("hi,mini-vue")
    })



    it('objcet', () => {

        var obj1: any = {}
        var obj2: any = obj1;
        obj2.name = "Xxx";
        console.log(obj1.name);  //

        expect(obj1).toBe(obj2)

    })

    it("tes-js-class", () => {
        const benz = new Car("舒马赫", "benz");
        benz.age = 10;
        const putlog = benz.drive();
        expect(putlog).toBe(true);
    })

    it("set-map", () => {
        let mySet = new Set([1, 2, 3]);
        mySet.add(2);
        debugger
    })
})