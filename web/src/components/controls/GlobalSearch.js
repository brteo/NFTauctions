import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Input, AutoComplete } from 'antd';

import Api from '../../helpers/api';
import UserPic from '../UserPic';

const { Search } = Input;

const GlobalSearch = props => {
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);
	const [searchOptions, setSearchOptions] = useState(null);
	const [searchValue, setSearchValue] = useState(query.get('query'));

	const handleSelect = (value, option) => {
		if (option.type === 'nft') {
			history.push('/nft/' + option.id);
		} else {
			history.push('/profile/' + option.id);
		}

		setSearchValue(null);
	};

	const resultParser = results => {
		const options = [];

		if (results.users.length > 0) {
			const users = { label: 'Users', options: [] };
			results.users.forEach(user => {
				users.options.push({
					type: 'user',
					id: user._id,
					value: 'user' + user._id,
					label: (
						<>
							<UserPic user={user} size={40} /> <span className="userNick">{user.nickname}</span>
						</>
					)
				});
			});

			options.push(users);
		}

		if (results.nfts.length > 0) {
			const nfts = { label: 'Nfts', options: [] };
			results.nfts.forEach(nft => {
				nfts.options.push({
					type: 'nft',
					id: nft._id,
					value: 'nft' + nft._id,
					label: (
						<>
							<img alt={nft.description} src={nft.url} className="nftImage" />{' '}
							<span className="nftTitle">{nft.title}</span>
						</>
					)
				});
			});

			options.push(nfts);
		}

		return options;
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
