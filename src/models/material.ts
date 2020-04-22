import { ChoicesData } from '../components/qa/IData/choices';

export interface Material {
  uuid: string | null; // null - material not loaded yet
  data: ChoicesData | null; // TODO list of components interfaces
}
