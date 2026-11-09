interface EmailTextProps {
  email: string
}

/**
 * Un correo escrito de forma que, si no cabe en la línea, se corta justo antes de la @ (y no por en
 * medio de una palabra, como hace break-all).
 */
export function EmailText({ email }: EmailTextProps) {
  const at = email.indexOf('@')
  if (at < 0) return <>{email}</>
  return (
    <>
      {email.slice(0, at)}
      <wbr />
      {email.slice(at)}
    </>
  )
}
