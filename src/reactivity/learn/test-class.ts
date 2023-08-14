

export class Car {

    private carName: string;
    private driver: string;
    public age: number | string | undefined;

    constructor(_driver: string, _carName: string, _age?: number | string | undefined) {
        this.carName = _carName;
        this.driver = _driver;
        this.age = _age;
    }

    drive(): boolean {
        console.log(this.driver + "，开着" + this.carName + ",这辆车已经：" + this.age + "年");
        return true;
    }
}