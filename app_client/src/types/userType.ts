export interface UserType {
    _id: string;
    username: string;
    email: string;
    role: string;
    logins: {
        type: string;
        created_at: string;
        updated_at: string;
    }
    created_at: string;
    updated_at: string;
}
