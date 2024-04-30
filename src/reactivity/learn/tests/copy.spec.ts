describe('copy', () => {

    it("shallo",()=>{
        const fxArr = ['one', 'two', 'three']
        const fxArrs = fxArr.slice(0)
        fxArrs[1] = 'love',
        console.log(fxArr);
        console.log(fxArrs);
        debugger
        expect(fxArr).toEqual(fxArrs)
    })
    it.only("ptoto", () => {
        class Person {
            name: any;
            constructor(name){
                this.name = name;
            }
        }
        class Teacher extends Person {
            subject: any;
            constructor(name,subject){
                super(name);
                this.subject = subject;
            }
            teach(){
                console.log(`${this.name} is teaching ${this.subject}`);
            }
        }

        const teacher = new Teacher('John', 'Math');
        console.log(teacher);
        teacher.teach();

        debugger

    })

})