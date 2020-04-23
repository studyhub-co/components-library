import { QAData } from '../components/qa/IData/index';

export interface Material {
  uuid: string | null; // null - material not loaded yet
  data: QAData | null; // TODO list of components interfaces
}
