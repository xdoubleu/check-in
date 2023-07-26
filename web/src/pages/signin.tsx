import styles from "./signin.module.css"
import { Col, Form } from "react-bootstrap"
import BaseLayout from "layouts/BaseLayout"
import { signIn } from "api-wrapper"
import { useRouter } from "next/router"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useAuth } from "contexts/authContext"
import BaseForm from "components/forms/BaseForm"
import FormInput from "components/forms/FormInput"
import { type SignInDto } from "api-wrapper/types/apiTypes"
import { Redirecter } from "components/Redirecter"

// eslint-disable-next-line max-lines-per-function
export default function SignIn() {
  const { setUser } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    //setError,
    formState: { errors }
  } = useForm<SignInDto>({
    defaultValues: {
      rememberMe: true
    }
  })

  const onSubmit: SubmitHandler<SignInDto> = (data) => {
    void signIn(data).then((response) => {
      if (response.ok) {
        setUser(response.data)
        return router.push("/")
      }
      // eslint-disable-next-line no-warning-comments
      //TODO: fix
      /*setError("root", {
        message: response.message ?? "Something went wrong"
      })*/
      return new Promise((resolve) => resolve(true))
    })
  }

  return (
    <Redirecter>
      <BaseLayout title="Sign In" showLinks={true}>
        <Col md={4} style={{ margin: "auto" }}>
          <h1 className="text-center">Sign In</h1>
          <br />

          <BaseForm
            className={styles.customForm}
            onSubmit={handleSubmit(onSubmit)}
            errors={errors}
            submitBtnText="Sign In"
          >
            <FormInput
              label="Username"
              type="text"
              placeholder="Username"
              required
              autocomplete="username"
              register={register("username")}
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="Password"
              required
              autocomplete="current-password"
              register={register("password")}
            />
            <Form.Check
              label="Remember me"
              type="checkbox"
              {...register("rememberMe")}
            ></Form.Check>
          </BaseForm>
          <br />
          <br />
        </Col>
      </BaseLayout>
    </Redirecter>
  )
}
