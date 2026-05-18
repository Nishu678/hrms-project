"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

import React from "react";

type PaginationProps = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage?: (items: number) => void;
  totalItems: number;
  className?: string;
};

const AppPagination: React.FC<PaginationProps> = ({
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalItems,
  className = "",
}) => {
  const lastPage = Math.ceil(totalItems / itemsPerPage);
  const canPreviousPage = currentPage > 1;
  const canNextPage = currentPage < lastPage;

  const goPreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  const goNextPage = () =>
    canNextPage ? setCurrentPage(currentPage + 1) : null;

  // Calculate the range of items being displayed
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <>
      <div className={cn(`flex gap-5`, className)}>
        <div className="flex items-center gap-4">
          <Pagination className="w-auto">
            <PaginationContent>
              {currentPage > 2 && (
                <>
                  <PaginationItem className="">
                    <PaginationLink
                      onClick={() => setCurrentPage(1)}
                      href="#"
                      isActive
                      className="cursor-pointer size-8"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {currentPage > 3 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="cursor-pointer size-8"
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationLink
                  isActive
                  className="cursor-pointer px-2 py-1 rounded-md border-2 border-blue-500 size-8"
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              {currentPage < lastPage - 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      isActive
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="cursor-pointer size-8"
                    >
                      {currentPage + 1}
                    </PaginationLink>
                  </PaginationItem>

                  {currentPage < lastPage - 2 && (
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                </>
              )}
              {currentPage < lastPage && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(lastPage)}
                      isActive
                      className="cursor-pointer size-8"
                    >
                      {lastPage}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
            </PaginationContent>
          </Pagination>
          <div className="text-xs 2xl:text-sm text-gray-600">
            Showing {startItem} to {endItem} of {totalItems} items
          </div>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  className={`border text-[10px] 2xl:text-sm h-8 2xl:h-9 ${
                    canPreviousPage
                      ? "cursor-pointer"
                      : "opacity-50 disabled:cursor-not-allowed"
                  } `}
                  onClick={canPreviousPage ? goPreviousPage : undefined}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className={`border text-[10px] 2xl:text-sm h-8 2xl:h-9 ${
                    canNextPage
                      ? "cursor-pointer"
                      : "opacity-50 disabled:cursor-not-allowed"
                  }`}
                  onClick={canNextPage ? goNextPage : undefined}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default AppPagination;
