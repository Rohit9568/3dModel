import { Modal, Select } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { fetchChapterTopicsById } from '../../features/topic/topicSlice'
import { IconTeachAddContent } from '../_Icons/CustonIcons'
import { addUserTopic } from '../../features/userChapter/userChapterSlice'
import { useDispatch } from 'react-redux'
import { chapter } from '../../store/chapterSlice'
import { fetchCurrentChapter } from '../../features/UserSubject/TeacherSubjectSlice'
const chapterActions = chapter.actions

interface ITopic {
  label: string
  value: string
}

interface IProps {
  isModalOpen: boolean
  setIsModalOpen: (a: boolean) => void
  selectedChapter: SingleChapter
  selectedTopic: SingleTopic | null
  setSelectedTopic: (s: SingleTopic) => void
  handleEditContent: () => void
  scrollToEnd: () => void
}

const AddContentModal: React.FC<IProps> = ({
  isModalOpen,
  setIsModalOpen,
  selectedTopic,
  selectedChapter,
  setSelectedTopic,
  handleEditContent,
  scrollToEnd
}) => {
  const [chapterTopics, setChapterTopics] = useState<ITopic[]>([])
  const [newTopicId, setNewTopicId] = useState<string | null>(null)
  const [newTopicName, setNewTopicName] = useState<string>('')
  const selectRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  useEffect(() => {
    const getTopics = async () => {
      try {
        const response = (await fetchChapterTopicsById(selectedChapter?.chapterId)) as any[]
        if (response.length > 0) {
          const transformedData: any[] = []
          response.forEach((m: any) => {
            transformedData.push({
              label: m.name,
              value: m?._id
            })
          })
          setChapterTopics(transformedData)
        }
      } catch (err) {
        console.log('Some error Occured in getting topics')
      }
    }
    if (selectedChapter?.chapterId) getTopics()
  }, [selectedChapter])

  const fetchChapter = async (chapter_id: string) => {
    fetchCurrentChapter({ chapter_id: chapter_id })
      .then((data: any) => {
        // setLoadingData(false);
        dispatch(chapterActions.setCurrentChapter(data))
        if (data?.topics?.at(-1)) {
          // scrollToEnd()
          setTimeout(() => {
            setSelectedTopic(data.topics.at(-1))
          }, 200);
          setTimeout(() => {
            handleEditContent()
          }, 500);
        }
      })
      .catch((error) => {
        // setLoadingData(false);
        console.log(error)
      })
  }

  const handleAddUserTopic = async () => {
    try {
      const response: any = await addUserTopic(selectedChapter?._id, newTopicId, newTopicName)
      // dispatch(chapterActions.setCurrentChapter(response))
      await fetchChapter(selectedChapter?._id)
      setIsModalOpen(false)
    } catch (err) {
      console.log("some error occured can't create new user topic", err)
    }
  }

  return (
    <Modal
      centered
      opened={isModalOpen}
      onClose={() => {
        setIsModalOpen(false)
      }}
      title={
        <Title>{selectedTopic?._id ? <h4>Add Content</h4> : 'Please Select a valid topic'}</Title>
      }
    >
      <Content>
        <Select
          data={chapterTopics}
          placeholder='Select a topic'
          nothingFound='Nothing found'
          searchable
          creatable
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={(query) => {
            setNewTopicName(query)
            setNewTopicId(null)
            return null
          }}
          onChange={(s) => {
            setNewTopicId(s)
            const topic = chapterTopics.find((t) => t.value === s)
            if (topic?.label) {
              setNewTopicName(topic.label)
            }
          }}
          ref={selectRef}
        />
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
        <SubmitButton disabled={newTopicName?.length === 0} onClick={handleAddUserTopic}>
          <IconTeachAddContent /> Add Content
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
  color: black;
  border: 1px black solid;
  font-weight: 400;
  cursor: pointer;
  background-color: white;
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
  svg {
    stroke: white;
    path {
      fill: white;
    }
  }
  &:disabled {
    cursor: not-allowed;
  }
`

export default AddContentModal
