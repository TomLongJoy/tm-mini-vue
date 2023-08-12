import { Car } from "../test-reactive";

describe("reactive", () => {

    it("tes-js-class", () => {
        const benz = new Car("舒马赫", "benz");
        benz.age = 10;
        const putlog = benz.drive();
        expect(putlog).toBe(true);
    })

    it("set-map", () => {

        let mySet = new Set([1,2,3]);

        mySet.add(2);
        debugger
    })
})