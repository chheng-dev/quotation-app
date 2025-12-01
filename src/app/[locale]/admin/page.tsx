import { SectionCards } from "@/src/components/section-cards"
import data from "./data.json"
import { ChartAreaInteractive } from "@/src/components/chart-area-interactive"
import { DataTable } from "@/src/components/data-table"


export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-3">
          <SectionCards />
          <div className="px-4">
            <ChartAreaInteractive />
          </div>
          <DataTable data={data} />
        </div>
      </div>
    </div>
  )
}
