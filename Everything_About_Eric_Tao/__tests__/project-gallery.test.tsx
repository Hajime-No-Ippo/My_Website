import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Simplify Next Image and framer-motion for tests
jest.mock("next/image", () => (props: any) => {
  const { src, alt, fill, sizes, priority, ...rest } = props
  return <img src={typeof src === "string" ? src : src?.src ?? ""} alt={alt || ""} {...rest} />
})

jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

import ProjectGallery from "@/components/project-gallery"
import { projects } from "@/data/projects"

// Expectations are derived from the data, not hardcoded, so adding a project
// or a category cannot silently invalidate this test.
const categories = Array.from(new Set(projects.map((item) => item.category)))

describe("ProjectGallery filtering", () => {
  it("shows every project by default", () => {
    render(<ProjectGallery />)
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(projects.length)
  })

  it("renders a filter button for every category present in the data", () => {
    render(<ProjectGallery />)
    for (const category of categories) {
      expect(screen.getByRole("button", { name: category })).toBeInTheDocument()
    }
  })

  it.each(categories)("filters down to only %s projects", async (category) => {
    render(<ProjectGallery />)
    const expected = projects.filter((item) => item.category === category)

    await userEvent.click(screen.getByRole("button", { name: category }))

    const headings = screen.getAllByRole("heading", { level: 3 })
    expect(headings).toHaveLength(expected.length)
    expect(headings.map((heading) => heading.textContent)).toEqual(
      expect.arrayContaining(expected.map((item) => item.title)),
    )
  })
})
