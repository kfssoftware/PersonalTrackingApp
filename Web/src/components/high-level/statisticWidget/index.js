import React from 'react'
import { Card } from 'antd';
import PropTypes from "prop-types";
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Message2, Receipt, Star, User } from 'iconsax-react';

const StatisticWidget = ({ title, value, status, subtitle, prefix }) => {
	return (
		<Card className='text-center'>
			{
				status &&
				<span className={`font-size-xxl font-weight-bold ${status !== 0 && status === 1 ? 'text-success' : status === 2 ? 'text-success' : status === 3 ? 'text-warning' : status === 4 ? 'text-info' : 'text-danger'}`} >
					{status !== 0 &&
						status === 1 ? <User />
						:
						status === 2 ? <Receipt />
							:
							status === 3 ? <Star />
								:
								status === 3 ? <Message2 />
									:
									<Message2 />
					}
				</span>
			}
			{title && <h6 className="mb-0 mt-3">{title}</h6>}
			<div className={`${prefix ? 'd-flex' : ''} ${title ? 'mt-3' : ''}`}>
				{prefix ? <div className="mr-2">{prefix}</div> : null}
				<div>
					<div className="d-flex">
						<h4 className="mb-0 font-weight-bold w-100 text-center">{value}</h4>
					</div>
					{subtitle && <div className="text-gray-light mt-1">{subtitle}</div>}
				</div>
			</div>
		</Card>
	)
}

StatisticWidget.propTypes = {
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
	value: PropTypes.string,
	subtitle: PropTypes.string,
	status: PropTypes.number,
	prefix: PropTypes.element
};

export default StatisticWidget