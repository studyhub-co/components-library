import { QABaseData } from '../components/qaBase/IData/index';
import { QAData } from '../components/qaChoices/IData/index';
import { VectorData } from '../components/vector/IData/index';
import { UnitConversionData } from '../components/unitConversion/IData/index';
import { MySQLData } from '../components/mysql/IData/index';

export interface Material {
  uuid: string | null; // null - material not loaded yet
  data: QAData | VectorData | QABaseData | UnitConversionData | MySQLData | null; // TODO list of components interfaces
}

export interface UserReaction extends Material {
  reaction_start_on: Date;
}

export interface UserReactionResult {
  completed_on: null | string;
  correct_data?: QAData | VectorData | QABaseData | UnitConversionData | MySQLData;
  required_score: number;
  score: number;
  status: number;
  was_correct: boolean;
  next_material_uuid: string;
}
