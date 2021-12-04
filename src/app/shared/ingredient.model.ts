
export class Ingredient {
    //rather than declaring the public properties and then setting them
    //inside the constructor. Can just do like the following.
    //this is a typescript shortcut
    constructor(public name: string, public amount: number) { }
}