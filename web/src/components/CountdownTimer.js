import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

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

		const day = moment.utc(duration.asMilliseconds()).format('D');
		const hours = moment.utc(duration.asMilliseconds()).format('HH');
		const minutes = moment.utc(duration.asMilliseconds()).format('mm');
		const seconds = moment.utc(duration.asMilliseconds()).format('ss');

		return (
			<span className="countdown">
				{day > 0 && (
					<>
						<span className="countdown-value">{day}</span>
						<span className="countdown-label">{t('auction.dayLabel')} </span>
					</>
				)}
				<span className="countdown-value">{hours}</span>
				<span className="countdown-points">:</span>
				<span className="countdown-value">{minutes}</span>
				<span className="countdown-points">:</span>
				<span className="countdown-value">{seconds}</span>
			</span>
		);
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	return timeLeft;
};
export default Countdown;
