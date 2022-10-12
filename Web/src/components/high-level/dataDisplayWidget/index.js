import React from 'react'
import { Card, Avatar } from 'antd'
import Flex from '../flex'
import CustomStatistic from '../customStatistic'

const DataDisplayWidget = props => {
	const { size, value, title, icon, color, avatarSize, vertical } = props
	const customStatisticProps = { size, value, title }
	return (
		<Card className={"mt-3"} >
			<Flex alignItems="center" flexDirection={vertical ? 'column' : 'row'}>
				<Avatar size={avatarSize} shape="square" icon={icon} className={`ant-avatar-${color}`}/>
				<div className={vertical ? 'mt-3 text-center' : 'ml-3'}>
					<CustomStatistic {...customStatisticProps}/>
				</div>
			</Flex>
		</Card>
	)
}

DataDisplayWidget.defaultProps = {
	avatarSize: 50,
	vertical: false
};

export default DataDisplayWidget
