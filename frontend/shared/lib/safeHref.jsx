// Using a new reference in case encodeUri gets overwritten in runtime
const encode = encodeURI

const checkJavascript = url => url.trim().startsWith("javascript:")

export const safeHref = url => {
  if (checkJavascript(url)) {
    return ""
  }

  return encode(url)
}
