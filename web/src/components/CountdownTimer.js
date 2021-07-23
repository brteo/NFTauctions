import { useState, useEffect } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const Countdown = props => {
	const { t } = useTranslation();

	const calculateTimeLeft = () => {
		const eventTime = new Date(props.eventTime).getTime() / 1000;
		const currentTime = Math.floor(Date.now() / 1000).toString();
		const leftTime = eventTime - currentTime;
		let duration = moment.duration(leftTime, 'seconds');
		const interval = 1000;

		if (duration.asSeconds() <= 0) {
			clearInterval(interval);
		}

		duration = moment.duration(duration.asSeconds() - 1, 'seconds');
		return (
			duration.days() +
			' ' +
			t('auction.days') +
			' ' +
			duration.hours() +
			' ' +
			t('auction.hours') +
			' ' +
			duration.minutes() +
			' ' +
			t('auction.minutes') +
			' ' +
			duration.seconds() +
			' ' +
			t('auction.seconds')
		);
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);
	});

	return timeLeft;
};
export default Countdown;
