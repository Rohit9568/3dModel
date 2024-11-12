import { Button, Group, Input, Modal, Text } from '@mantine/core';
import { useState } from 'react'

const AddFolderModal = (props:{
    addFolder: (val: string) => void;
    onCancelClick: ()=> void
}) => {
    const [folder,setFolder] = useState("");
    const handleSubmit = (e:any) =>{
        setFolder(e.target.value)
    }
  return (
    <div style={{width:250}}>
        <Input value={folder} placeholder="Enter the name of your folder" onChange={handleSubmit} />
        <Group position="center" mt={20}>
          <Button
            variant="outline"
            color="dark"
            fw={700}
            radius={50}
            onClick={() => {
              props.onCancelClick();
            }}
          >
            Cancel
          </Button>
          <Button
            fw={700}
            radius={50}
            bg={"primary"}
            onClick={() => {
              props.addFolder(folder)
            }}
          >
            Submit
          </Button>
          </Group>
    </div>
  )
}

export default AddFolderModal
