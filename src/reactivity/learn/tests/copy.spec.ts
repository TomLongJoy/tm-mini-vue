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
})