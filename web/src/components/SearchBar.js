import { Input } from 'antd';

const { Search } = Input;

const onSearch = value => console.log(value);

const SearchBar = props => {
	return <Search placeholder="Search" onSearch={onSearch} enterButton allowClear size="large" />;
};

export default SearchBar;
