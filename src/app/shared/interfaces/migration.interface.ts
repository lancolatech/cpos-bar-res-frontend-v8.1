import { FirebaseCollectionTypes } from "./database-item.interface";

export interface MigrationInterface {
    collection: FirebaseCollectionTypes,
    endpoint: string,
}