import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiProductionURL } from '../../data/api.data';
import { take } from 'rxjs';
import { FirebaseCollectionTypes } from '../../interfaces/database-item.interface';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {

  constructor(
    private httpClient: HttpClient,
  ) { }


  async migrate(endpoints: string[]) {
    return new Promise<any>((resolve, reject) => {

      const makeSure = confirm("Do you want to run a migration from Laravel to Nest js API?");
      if (!makeSure) throw new Error("Migration Cancelled");


      const promises: Promise<any>[] = [];
      endpoints.forEach(endpoint => {
        const promise = this.migrateOneTable(endpoint);
        promises.push(promise);
      });

      Promise.all(promises).then(res => {
        console.log(res);


      })
    })
  }


  private async migrateOneTable(endpoint: string) {
    const collection = endpoint as FirebaseCollectionTypes;
    const items = await this.getDataFromLaravelAPI(endpoint);
    const migrated = await this.sendToNestAPI(endpoint, collection, items);
  }


  private async getDataFromLaravelAPI(endpoint: string) {
    return new Promise<any[]>((resolve, reject) => {
      const url = this.getLaravelEndpoint(endpoint);
      this.httpClient.get(url).pipe(take(1)).subscribe({
        next: (data) => {
          console.log(data);
          const items = data as any[];

          resolve(items || []);
        },
        error: (err) => {
        },
      });
    });
  }

  private async sendToNestAPI(endpoint: string, collection: FirebaseCollectionTypes, data: any) {
    return new Promise<any>((resolve, reject) => {
      const url = this.getNestEndpoint(endpoint);
      const orgId = `bcnYfM0BUAWmaMWEglzM`;

      const firebaseCollection = `organizations/${orgId}/${endpoint}` as FirebaseCollectionTypes;
      const payload = {
        collection,
        orgId,
        data,
      }
      this.httpClient.post(url, payload).pipe(take(1)).subscribe({
        next: (data) => {
          console.log(data);

          resolve(data);
        },
        error: (err) => {
        },
      });
    })
  }


  private getLaravelEndpoint(endpoint: string) {
    const url = `${apiProductionURL}/${endpoint}`;
    return url;
  }

  private getNestEndpoint(endpoint: string) {
    // `https://cpos-bar-res-backend.vercel.app`
    const orgId = `bcnYfM0BUAWmaMWEglzM`;
    // const url = `https://cpos-bar-res-backend.vercel.app/organizations/${orgId}/${endpoint}`;
    // const url = `https://cpos-bar-res-backend.vercel.app/organizations/${orgId}/migrate`;
    const url = `https://cpos-bar-res-backend.vercel.app/migrate`;
    return url;
  }
}
