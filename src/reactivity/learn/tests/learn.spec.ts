import { Car } from "../test-class";

describe("reactive", () => {

    it.only('objcet', () => {

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