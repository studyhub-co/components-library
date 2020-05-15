import { QABaseData } from '../components/qaBase/IData/index';
import { QAData } from '../components/qaChoices/IData/index';
import { VectorData } from '../components/vector/IData/index';

export interface Material {
  uuid: string | null; // null - material not loaded yet
  data: QAData | VectorData | QABaseData | null; // TODO list of components interfaces
}
