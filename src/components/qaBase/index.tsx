import React, { createRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ThemeProvider } from '@material-ui/core/styles';

import Container from '../layout/Container/index';
import ContainerItem from '../layout/ContainerItem/index';
import Paper from '../layout/Paper/index';

import * as materialActionCreators from '../../redux/modules/material';

import { QABaseData as IQABaseData } from './IData/index';

import Question from '../common/question';

// import { Question as IQuestion } from '../common/IData/question';

// hook to work with componentData
import { useComponentData } from './componentData';

import { theme } from '../style';

// eslint-disable-next-line @typescript-eslint/interface-name-prefix
interface IQAProps {
  component: any;
  currentMaterial: materialActionCreators.MaterialRedux;
  editMode: boolean;
  componentData: IQABaseData;
  // redux actions
  fetchMaterial(uuid: string | undefined): void;
}

const Index: React.FC<IQAProps> = props => {
  const { currentMaterial, editMode: editModeProp, fetchMaterial, componentData: componentDataProp } = props;

  const [selectedChoiceUuid, setSelectedChoiceUuid] = useState('');
  const [editMode, setEditMode] = useState(editModeProp);

  const { data: componentData, dispatch } = useComponentData(componentDataProp, currentMaterial);

  useEffect(() => {
    // catch parent event inside iframe
    window.addEventListener('message', ({ data }) => {
      if (data.hasOwnProperty('type')) {
        if (data.type === 'pib_edit_mode') {
          if (data.data === 'edit') {
            setEditMode(true);
          } else {
            setEditMode(false);
          }
        }
      }
      return window.removeEventListener('message', () => {});
    });
  }, []);

  useEffect(() => {
    setEditMode(editModeProp);
    if (editModeProp === false) {
      // TODO update componentData redux state
    }
  }, [editModeProp]);

  // loaded in generic component type
  // useEffect(() => {
  //   fetchMaterial(undefined);
  // }, [fetchMaterial]);

  // TODO move dispatch and question related funcs to Question component
  const onQuestionTextChange = (text: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_TEXT_CHANGE', payload: text });
    }
  };

  const onQuestionHintChange = (text: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_HINT_CHANGE', payload: text });
    }
  };

  const onAnswerTextChange = (text: string): void => {
    if (componentData) {
      dispatch({ type: 'ANSWER_TEXT_CHANGE', payload: text });
    }
  };

  const onQuestionImageChange = (image: string): void => {
    if (componentData) {
      dispatch({ type: 'QUESTION_IMAGE_CHANGE', payload: image });
    }
  };

  const onAnswerImageChange = (image: string): void => {
    if (componentData) {
      dispatch({ type: 'ANSWER_IMAGE_CHANGE', payload: image });
    }
  };

  // console.log(componentData);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        {componentData && ( // need to wait componentData
          <Container>
            <ContainerItem>
              <Paper>
                <Question
                  editMode={editMode}
                  question={componentData.question}
                  onTextChange={onQuestionTextChange}
                  onHintChange={onQuestionHintChange}
                  onImageChange={onQuestionImageChange}
                />
              </Paper>
            </ContainerItem>
            <ContainerItem>
              <Paper>
                <Question
                  editMode={editMode}
                  question={componentData.answer}
                  onTextChange={onAnswerTextChange}
                  onImageChange={onAnswerImageChange}
                />
              </Paper>
            </ContainerItem>
          </Container>
        )}
      </div>
    </ThemeProvider>
  );
};

export default connect(
  (state: any) => {
    return { currentMaterial: state.material };
  },
  dispatch => bindActionCreators(materialActionCreators, dispatch),
)(Index);
