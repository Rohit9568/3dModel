import ApiHelper from '../../utilities/ApiHelper'

export function fetchEasyTheoryByTopicId(data: {
  _id: string
  className: string
  subjectName: string
  chapterName: string
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/topic/${data._id}/easyTheory?className=${data.className}&&subjectName=${data.subjectName}&&chapterName=${data.chapterName}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
}
export function fetchHardTheoryByTopicId(data: {
  _id: string
  className: string
  subjectName: string
  chapterName: string
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/topic/${data._id}/hardTheory?className=${data.className}&&subjectName=${data.subjectName}&&chapterName=${data.chapterName}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
}
export function fetchExamplesByTopicId(data: {
  _id: string
  className: string
  subjectName: string
  chapterName: string
}) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(
      `/api/v1/topic/${data._id}/theoryExamples?className=${data.className}&&subjectName=${data.subjectName}&&chapterName=${data.chapterName}`
    )
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
}
export function fetchChapterTopicsById(chapterId: string) {
  return new Promise((resolve, reject) => {
    ApiHelper.get(`/api/v1/chapter/getChapterTopics/${chapterId}`)
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
}

