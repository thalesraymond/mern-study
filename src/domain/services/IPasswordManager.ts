export default interface IPasswordManager {
    hash(password: string): Promise<string> | string;
    compare(password: string, hashed: string): Promise<boolean> | boolean;
}