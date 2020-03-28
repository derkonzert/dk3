import React from "react"
import { mount } from "enzyme"
import RichText, { Provider } from "./react"
import { Link } from "./plugins"

describe("react", () => {
  const exampleInput = `# This is a
  
  What should happen https://www.youtube.com/watch?v=c4eO2o9u1j0 here or https://derkonzert.de/about here?
  
  https://vimeo.com/2707962`

  it("should render them correctly…", () => {
    const element = mount(<RichText value={exampleInput} />)

    const iframes = element.find("iframe")

    expect(iframes.length).toBe(2)
    expect(iframes.at(0).props().src).toBe(
      "https://www.youtube.com/embed/c4eO2o9u1j0"
    )
    expect(iframes.at(1).props().src).toBe(
      "https://player.vimeo.com/video/2707962"
    )

    expect(element.find("h1").text()).toBe("This is a")

    expect(element.find("a").props().href).toBe("https://derkonzert.de/about")
  })

  it("allows setting custom plugins", () => {
    const CustomLink = props => <a {...props} />
    const CustomLinkPlugin = Link.createCopy({
      renderer: token => (
        <CustomLink href={token.value.href}>{token.value.href}</CustomLink>
      ),
    })

    const element = mount(
      <Provider value={[CustomLinkPlugin]}>
        <RichText
          value={
            "Visit this link https://derkonzert.de to know all about concerts in munich"
          }
        />
      </Provider>
    )

    expect(element.find(CustomLink).props().href).toBe("https://derkonzert.de")
  })
})
