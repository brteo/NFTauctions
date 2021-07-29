import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Input, AutoComplete } from 'antd';
import Api from '../../helpers/api';

const { Search } = Input;

const GlobalSearch = props => {
	const { resultParser, onSelect } = props;

	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);
	const [searchOptions, setSearchOptions] = useState(null);
	const [searchValue, setSearchValue] = useState(query.get('query'));

	const handleSelect = (value, option) => {
		onSelect(value, option);
		setSearchValue(null);
	};

	let searchTimeout;
	const search = q => {
		Api.get('/search/' + q)
			.then(res => {
				const options = resultParser(res.data);
				setSearchOptions(options);
			})
			.catch(err => {
				if (err.globalHandler) err.globalHandler();
			});
	};
	const handleSearch = q => {
		if (searchTimeout) clearTimeout(searchTimeout);

		if (q && q.trim()) searchTimeout = setTimeout(() => search(q), 300);
		else setSearchOptions([]);
	};
	const onSearch = q => q && q.trim() && history.push('/search?query=' + q.trim());

	return (
		<AutoComplete
			dropdownMatchSelectWidth={300}
			options={searchOptions}
			onSelect={handleSelect}
			onSearch={handleSearch}
			value={searchValue}
			onChange={v => setSearchValue(v)}
		>
			<Search placeholder="Search" onSearch={onSearch} allowClear />
		</AutoComplete>
	);
};

export default React.memo(GlobalSearch);
