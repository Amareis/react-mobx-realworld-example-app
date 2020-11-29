import React from 'react';

export type PaginationProps = {
    totalPagesCount: number
    currentPage: number
    onSetPage: (page: number) => void
}

const ListPagination = (props: PaginationProps) => {
  if (props.totalPagesCount < 2) {
    return null;
  }

  const range: number[] = [];
  for (let i = 0; i < props.totalPagesCount; ++i) {
    range.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {
          range.map(v => {
            const isCurrent = v === props.currentPage;
            const onClick = ev => {
              ev.preventDefault();
              props.onSetPage(v);
            };
            return (
              <li
                className={ isCurrent ? 'page-item active' : 'page-item' }
                onClick={onClick}
                key={v.toString()}
              >

                <a className="page-link" href="">{v + 1}</a>

              </li>
            );
          })
        }

      </ul>
    </nav>
  );
};

export default ListPagination;
