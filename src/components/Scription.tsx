/* eslint-disable @typescript-eslint/no-explicit-any */
function Scription(props: { data: any }) {
  return <div className='flex rounded-lg shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col hover:border-purple-500 cursor-pointer overflow-hidden hover'>
    <div className="p-4 overflow-x-hidden overflow-y-auto flex-1 bg-[rgb(48,52,61)]">
      <pre className="text-sm break-all whitespace-pre-wrap">
        {JSON.stringify(JSON.parse(props.data.content), null, 2)}
      </pre>
    </div>
    <div className="p-4 bg-[rgb(80,86,98)]">
      <div className="flex justify-between items-center text-base mb-3">
        <span className="truncate inline-block max-w-[50%]">#{props.data.number}</span>
        <span className="truncate inline-block max-w-[50%]">0xe9ff...13560b</span>
      </div>
      <div className="text-sm"> Created &nbsp; a minute ago</div>
    </div>
  </div>
}

export default Scription