import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  key: string = 'a8e9dc256a38d07eaa86c47733a802a9e6414e6ab4b4b8c3d7fd4c2469d6e5bb';
  constructor(
    private httpClient: HttpClient,
  ) {

  }

  // Encrypts a string using an encryption key
  encrypt(str: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.httpClient.post(`${environment.apiRootUrl}/encrypt`, { value: str }).pipe(take(1)).subscribe({
        next: (data) => {
          if (data) {
            const encryptedString = data as string;
            const locallyEncrypted = this.localEncrypt(encryptedString)
            resolve(locallyEncrypted);
          }
        },
        error: (err) => {
        },
      });
    })
  }

  localEncrypt(str: string): string {

    // convert the string to bytes
    const bytes = CryptoJS.AES.encrypt(str, this.key);

    // convert the encrypted bytes to a string format
    const encryptedStr = bytes.toString();

    return encryptedStr;
  }

  decrypt(str: string): string {
    // convert the encrypted string to bytes
    const bytes = CryptoJS.AES.decrypt(str, this.key);

    // convert the decrypted bytes to a string format
    const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedStr) console.log('error');


    return decryptedStr;
  }
}
