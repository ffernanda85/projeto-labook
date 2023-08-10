export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
}

export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
}

export interface UserDB {
    
}

/* export class User{
    constructor(
        private name: string,
        private email: string,
        private password: string
    ) { }

     //MÉTODOS SETTERS E GETTERS 
    public getName() : string {
        return this.name
    }
    public setName(newName : string): void {
        this.name = newName;
    }
    
    public getEmail() : string {
        return this.email
    }
    public setEmail(newEmail : string): void {
        this.email = newEmail;
    }
    
    public getPassword() : string {
        return this.password
    }
    public setPassword(newPassword : string): void {
        this.password = newPassword;
    }
    
}
 */