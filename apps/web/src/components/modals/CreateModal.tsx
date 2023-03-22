import { type ReactElement, useState } from "react"
import { Col, Modal } from "react-bootstrap"
import CustomButton from "@/components/CustomButton"
import {
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn
} from "react-hook-form"
import type APIResponse from "my-api-wrapper/dist/src/types/apiResponse"
import BaseForm from "../forms/BaseForm"

interface CreateModalProps<T extends FieldValues, Y> {
  children: ReactElement | ReactElement[]
  form: UseFormReturn<T>
  handler: (data: T) => Promise<APIResponse<Y>>
  refetchData: () => Promise<void>
  typeName: string
}

export default function CreateModal<
  T extends FieldValues,
  Y extends FieldValues
>({ children, form, handler, refetchData, typeName }: CreateModalProps<T, Y>) {
  const [showCreate, setShowCreate] = useState(false)
  const handleCloseCreate = () => setShowCreate(false)
  const handleShowCreate = () => setShowCreate(true)

  const onSubmit: SubmitHandler<T> = async (data) => {
    const response = await handler(data)
    if (!response.ok) {
      form.setError("root", {
        message: response.message ?? "Something went wrong"
      })
    } else {
      handleCloseCreate()
      form.reset()
      await refetchData()
    }
  }

  return (
    <>
      <Modal show={showCreate} onHide={handleCloseCreate}>
        <Modal.Body>
          <Modal.Title>Create {typeName.toLowerCase()}</Modal.Title>
          <br />
          <BaseForm
            onSubmit={form.handleSubmit(onSubmit)}
            errors={form.formState.errors}
            submitBtnText="Create"
            onCancelCallback={handleCloseCreate}
          >
            {children}
          </BaseForm>
        </Modal.Body>
      </Modal>

      <Col size={2}>
        <CustomButton onClick={handleShowCreate}>Create</CustomButton>
      </Col>
    </>
  )
}
