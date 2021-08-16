import React from 'react';
import { Drawer } from 'antd';

const MobileDrawer = props => {
	const { show, close } = props;

	return (
		<Drawer className="mobile-drawer" width="90vw" placement="left" onClose={() => close()} visible={show}>
			{props.children}
		</Drawer>
	);
};

export default MobileDrawer;
