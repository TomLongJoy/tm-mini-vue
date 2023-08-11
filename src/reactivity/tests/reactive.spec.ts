import { reactive } from "../reactive";
import { Car } from "./test-reactive";
describe("reactive", () => {
    it("happy path ", () => {
        const original = { foo: 1 };
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
    })
    it("tes-js-class", () => {
        const benz = new Car("舒马赫", "benz");
        benz.age = 10;
        const putlog = benz.drive();
        expect(putlog).toBe(true);
    })
})