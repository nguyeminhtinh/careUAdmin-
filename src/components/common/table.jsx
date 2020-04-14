import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import Pagination from './pagination';

const Table = ({ columns, sortColumn, onSort, data, totalPage, page, pageSz, handleChangePage, renderFooterTable, renderTitleTable }) => {
	return (
		<div>
			<table className="table table-bordered" id="tableA">
				<TableHeader
					columns={columns}
					sortColumn={sortColumn}
					onSort={onSort}
					renderTitleTable={renderTitleTable}
				/>
				<TableBody
					columns={columns}
					data={data}
					renderFooterTable={renderFooterTable}
				/>
			</table>
			{
				totalPage !== 0 &&
				<Pagination
					totalPage={totalPage}
					handleChangePage={handleChangePage}
					page={page}
					pageSz={pageSz}
				/>
			}
		</div>
	);
};

export default Table;
