import React from "react";
import _ from "lodash";

const TableHeader = (props) => {
	return (
		<thead>
			{
				_.isFunction(props.renderTitleTable) ?
					props.renderTitleTable() : <tr />
			}
			<tr>
				{props.columns.map((column, index) => (
					<th
						key={index}
					>
						{column.label}
					</th>
				))}
			</tr>
		</thead>
	);
}

export default TableHeader;
