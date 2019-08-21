import React from "react"
import { Dialog } from "@dk3/ui/components/Dialog"
import { SubTitle, Description } from "@dk3/ui/atoms/Typography"
import { LoginForm } from "./LoginForm"

export const LoginDialog = ({
  title,
  description,
  onLogin,
  onCancel,
  isOpen,
}) => (
  <Dialog isOpen={isOpen}>
    <SubTitle>{title}</SubTitle>
    {!!description && <Description mb="l">{description}</Description>}
    <LoginForm mv="m" onLogin={onLogin} onCancel={onCancel} />
  </Dialog>
)
