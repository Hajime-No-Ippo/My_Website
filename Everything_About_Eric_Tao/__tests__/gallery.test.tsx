import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

// Simplify Next legacy Image and framer-motion for tests
jest.mock("next/image", () => (props: any) => {
  const { src, alt, fill, ...rest } = props
  return <img src={typeof src === "string" ? src : src?.src ?? ""} alt={alt || ""} {...rest} />
})

jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

import Gallery from "@/components/gallery"

describe("Gallery filtering", () => {
  it("shows all items by default and filters by category", async () => {
    render(<Gallery />)

    // All works should render all four items initially
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(4)

    // Filter to Frontend (only one item)
    await userEvent.click(screen.getByRole("button", { name: /frontend/i }))
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(1)

    // Filter to UI/UX (two items)
    await userEvent.click(screen.getByRole("button", { name: /ui\/ux/i }))
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2)
  })
})
