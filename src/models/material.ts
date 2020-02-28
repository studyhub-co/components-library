import { ChoicesData } from '../components/data/choices';
// export class Material {
//   public uuid!: string | null; // null - not exist, '' - mock data
// }

// interface variant
export interface Material {
  uuid: string | null; // null - material not loaded yet
  data: ChoicesData | null;
}
