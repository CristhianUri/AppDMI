export interface User{
    uid: string,
    email: string,
    password: string,
    name: string,
    rol: string
}
export interface Student extends User{
    saldo: number
}
export interface Driver extends User{ 
    saldo: number
}
export interface Admin extends User{ 
}