import { useEffect } from 'react';

export function useFetchMaterial(
  editMode: boolean | undefined,
  fetchMaterial: (uuid: string) => void,
  fetchMaterialStudentView: (lessonUuid: string | undefined, materialUuid: string | undefined) => void,
  setUserReactionState: (userReactionState: string) => void,
  lessonUuid: string | undefined,
  materialUuid: string | undefined,
) {
  useEffect(() => {
    setUserReactionState('start');

    if (editMode === true) {
      // load as data edit
      if (materialUuid) {
        fetchMaterial(materialUuid);
      }
    } else if (lessonUuid) {
      // load as student view (with hidden fields)
      fetchMaterialStudentView(lessonUuid, materialUuid);
    }
  }, [editMode, fetchMaterial, fetchMaterialStudentView, setUserReactionState, lessonUuid, materialUuid]);
}
