// 0x000001
import { effect, stop } from "../effect";
import { reactive } from "../reactive";

describe("happy path ", () => {
    test("happy path one", () => {
        const user = reactive({
            age: 10
        })
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })
        expect(nextAge).toBe(11); 
        user.age++;
        expect(nextAge).toBe(12);
    })

    it("should return runner when call effect", () => {
        //1. effect(fn) -> function ( runner ) -> fn -> return;
        let foo = 10;
        const runner = effect(() => {
            foo++;
            return "foo";
        })
        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe("foo")
    })
    // 从vue3复制来的。
    it("scheduler", () => {
        // 1.通过 effect 的第二个参数给定的一个 scheduler 的 fn
        // 2. effect 第一次执行的时候，还会执行fn
        // 3. 当响应式对象 set update 不执行 fn 而是执行 scheduler
        // 4. 如果说当执行 runner 的时候，会再次的执行 fn
        // 5.
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => { // https://blog.csdn.net/xiebaochun/article/details/117701677
            run = runner;
        })
        const obj = reactive({ foo: 1 });
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            { scheduler }
        );
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        // should be called on first trigger
        obj.foo++; // 这里 obj.foo = obje.foo + 1;  

        expect(scheduler).toHaveBeenCalledTimes(1);
        // obj.foo = obj.foo + 1;  
        // expect(scheduler).toHaveBeenCalledTimes(2);
        // // should not run yet
        expect(dummy).toBe(1);
        // // manually run
        run();
        // // should have run
        expect(dummy).toBe(2);
    });
    it("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
            dummy = obj.prop;
        });
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        // obj.prop = 3;
        // get set 
        // obj.prop = obj.prop + 1;
        obj.prop++;
        expect(dummy).toBe(2);
        runner();

        expect(dummy).toBe(3);
    })
    it("onStop", () => {
        const obj = reactive({ foo: 1 });
        const onStop = jest.fn();
        let dummy;
        const runner = effect(
            () => {
                dummy = obj.foo;
            },
            {
                onStop,
            }
        );
        stop(runner);
        expect(onStop).toBeCalledTimes(1);

    })
}) 