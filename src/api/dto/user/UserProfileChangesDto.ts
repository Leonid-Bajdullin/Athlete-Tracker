import { User } from 'src/api/models/User';

export class UserProfileChangesDto {
    constructor(user: User) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.data = user.data;
        this.nickname = user.nickname;
        this.phone = user.phone;
        this.photoUrl = user.photoUrl;
    }
    public id: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public data: JSON;
    public nickname: string;
    public phone: string;
    public photoUrl: string;
}
