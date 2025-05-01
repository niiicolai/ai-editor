import CryptoJS from 'crypto-js';

export const useHash = () => {
    const hash = (content: string, algorithm: string = 'sha256'): string => {
        if (algorithm !== 'sha256') {
            throw new Error('Unsupported algorithm. Only sha256 is supported in this implementation.');
        }
        return CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex); // Returns the hash as a hexadecimal string
    };

    return { hash };
};
