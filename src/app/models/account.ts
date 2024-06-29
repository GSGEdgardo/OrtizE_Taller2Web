export interface Account {
    id: number;
    email: string;
    token: string;
    roleId: number;
    roleType: string;
    name: string;
    isActive: boolean;
}
