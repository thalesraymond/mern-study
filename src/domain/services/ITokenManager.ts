export default interface ITokenManager {
    generateToken(payload: object): string;
}