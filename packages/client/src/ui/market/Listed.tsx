import { BlockOrder, Blocks, Refresh, SearchTextField } from '@/components'
import { MOCK_LISTED } from '@/config'

export interface ListedProps {

}

function Listed() {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2 items-center">
          <span className="mt-[2px]">Result: 5585</span>
          <Refresh hideText />
        </div>
        <SearchTextField />
      </div>
      <Blocks>
        {MOCK_LISTED.map((data, index) => <BlockOrder key={index} data={data} />)}
      </Blocks>
    </>
  )
}

export default Listed
