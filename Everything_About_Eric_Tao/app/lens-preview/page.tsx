import FluidLens from "@/components/fluid-lens"
import SpecimenScene from "@/components/specimen-scene"

export default function LensPreviewPage() {
  return (
    <FluidLens className="h-[90vh] w-full">
      <SpecimenScene />
    </FluidLens>
  )
}
