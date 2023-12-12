import {isReactive, reactive } from "../reactive";
describe("reactive", () => {
      it("happy path ", () => {
            const original = { foo: 1 };

            /*
            Reflect 
            Proxy

            */
            const observed = reactive(original);
            // const observedTwo = original;
            expect(observed).not.toBe(original);
            expect(observed.foo).toBe(1);
            
            expect(isReactive(observed)).toBe(true)
            expect(isReactive(original)).toBe(false)
      })

})