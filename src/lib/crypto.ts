import * as CryptoJS from 'crypto-js';
import * as crypto from 'crypto';

export const generatePartnerId = () => {
    return crypto.randomBytes(6).toString('hex').substring(6).toUpperCase();
}

export const generateUniqueString = (bytes: number) => {
    return crypto.randomBytes(bytes).toString('base64');
}

export const encrypt = async (text: string, password: string) => {
    let encrypted = CryptoJS.AES.encrypt(text, password);
    return encrypted.toString();
}

export const decrypt = async (text: string, password: string) => {
    try {
        let bytes = CryptoJS.AES.decrypt(text, password);
        let decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted;
    } catch (error) {
        return;
    }
}