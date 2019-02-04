import React from "react"
import { State } from "react-powerplug"

import { LoginForm } from "./LoginForm"
import { SignUpForm } from "./SignUpForm"
import { ButtonLink } from "@dk3/ui/atoms/Typography"
import { withSpacing } from "@dk3/ui/utils/withSpacing"

export const LoginOrSignUpForm = withSpacing()(
  ({ className, onLogin, onSignUp, onCancel, defaultFormType = "login" }) => (
    <State initial={{ formType: defaultFormType }}>
      {({ state, setState }) => (
        <div className={className}>
          {state.formType === "login" ? (
            <React.Fragment>
              <LoginForm onLogin={onLogin} onCancel={onCancel} />
              <ButtonLink
                type="button"
                pa={1}
                mt={4}
                onClick={() => setState({ formType: "signUp" })}
              >
                {"Let me sign up, I don't have an account yet"}
              </ButtonLink>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <SignUpForm onSignUp={onSignUp} onCancel={onCancel} />
              <ButtonLink
                type="button"
                pa={1}
                mt={4}
                onClick={() => setState({ formType: "login" })}
              >
                {"Let me login, I already have an account"}
              </ButtonLink>
            </React.Fragment>
          )}
        </div>
      )}
    </State>
  )
)
