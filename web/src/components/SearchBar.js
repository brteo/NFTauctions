import { Input } from 'antd';
import { useTranslation } from 'react-i18next';

const { Search } = Input;

const onSearch = value => console.log(value);

const SearchBar = props => {
	const { t } = useTranslation();

	return <Search placeholder="Search" onSearch={onSearch} enterButton allowClear size="large" />;
};

export default SearchBar;
