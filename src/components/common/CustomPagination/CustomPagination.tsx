import { ChevronLeft, ChevronRight } from "lucide-react";

type CustomPaginationProps = {
  // 현재 사용자가 보고 있는 페이지
  currentPage: number;
  // 전체 항목의 갯수
  total: number;
  // 사용자가 페이지를 변경하였을때 호출할 콜백 함수
  onPageChangeHandler: (pageNumber: number) => void
}

const CustomPagination = ({ currentPage, total, onPageChangeHandler }: CustomPaginationProps) => {
  const totalPage = Math.ceil(total/10)
  const startPageIndex = Math.max(1, Math.min(totalPage - 4, currentPage - 2))
  const endPageIndex = Math.min(startPageIndex + 4, totalPage)

  if (totalPage < 2) {
    return null
  }

  return (
    <div className="flex flex-row items-center gap-x-4">
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChangeHandler(currentPage - 1)}
        className="h-10 flex items-center gap-1 pl-2.5 hover:cursor-pointer disabled:cursor-default"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>이전</span>
      </button>
      {Array.from({ length: endPageIndex - startPageIndex + 1}).map((_, idx) => {
        const pageIndex = startPageIndex + idx

        return (
          <button
            key={pageIndex}
            disabled={pageIndex === currentPage}
            onClick={() => onPageChangeHandler(pageIndex)}
            className="w-10 h-10 flex items-center justify-center leading-none rounded-md disabled:border disabled:border-gray-200 disabled:cursor-default disabled:bg-transparent hover:cursor-pointer hover:bg-gray-100"
          >
            {pageIndex}
          </button>
        )
      })}
      <button 
        disabled={currentPage === totalPage}
        onClick={() => onPageChangeHandler(currentPage + 1)}
        className="h-10 flex items-center gap-1 pr-2.5 hover:cursor-pointer disabled:cursor-default"
      >
        <span>다음</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default CustomPagination;
