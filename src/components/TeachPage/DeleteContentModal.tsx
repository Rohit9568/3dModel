import { Modal } from '@mantine/core'
import React from 'react'
import styled from 'styled-components'
import { removeUserTopic } from '../../features/userChapter/userChapterSlice'
import { useDispatch } from 'react-redux'
import { chapter } from '../../store/chapterSlice'
import { fetchCurrentChapter } from '../../features/UserSubject/TeacherSubjectSlice'
const chapterActions = chapter.actions

interface IProps {
  isModalOpen: boolean
  setIsModalOpen: (a: boolean) => void
  selectedChapter: SingleChapter
  selectedTopic: SingleTopic | null
  setLoadingData: (s: boolean) => void
}

const DeleteContentModal: React.FC<IProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedTopic,
  selectedChapter,
  setLoadingData
}) => {
  const dispatch = useDispatch()

  const fetchChapter = async (chapter_id: string) => {
    fetchCurrentChapter({ chapter_id: chapter_id })
      .then((data: any) => {
        // setLoadingData(false);
        dispatch(chapterActions.setCurrentChapter(data))
      })
      .catch((error) => {
        // setLoadingData(false);
        console.log(error)
      })
  }

  const handleDeleteContent = async () => {
    setIsModalOpen(false)
    if (selectedTopic?._id) {
      try {
        setLoadingData(true)
        const response: any = await removeUserTopic(selectedChapter._id, selectedTopic?._id)
        await fetchChapter(selectedChapter?._id)
        setLoadingData(false)
      } catch (err) {
        setLoadingData(false)
        console.log('Some error occoured, Failed to delete user topic')
      }
    }
  }

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        setIsModalOpen(false)
      }}
      title={<Title>Delete Topic</Title>}
    >
      <Content>
        {selectedTopic?._id ? <>Are you sure you want to delete this topic?</> : <></>}
      </Content>
      <ButtonContainer>
        <CancelButton
          onClick={() => {
            setIsModalOpen(false)
          }}
          disabled={!selectedTopic?._id}
        >
          Cancel
        </CancelButton>
        <SubmitButton disabled={!selectedTopic?._id} onClick={handleDeleteContent}>
          Yes
        </SubmitButton>
      </ButtonContainer>
    </Modal>
  )
}

const Content = styled.div`
  width: 100%;
  margin-bottom: 10px;
`
const Title = styled.span`
  font-family: 'Nunito';
  font-weight: 700;
`
const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

const CancelButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  cursor: pointer;
  background-color: #cccccc;
`
const SubmitButton = styled.button`
  border: 0;
  padding: 12px 20px;
  margin: 10px;
  border-radius: 24px;
  color: white;
  font-weight: 400;
  background-color: #4b65f6;
  cursor: pointer;
`

export default DeleteContentModal
