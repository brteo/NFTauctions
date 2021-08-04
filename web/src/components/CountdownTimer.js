import { useState, useEffect } from 'react';
import moment from 'moment';

const Countdown = props => {
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
		return moment.utc(duration.asMilliseconds()).format('DD:HH:mm:ss');
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	let timer;
	useEffect(() => {
		timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		return () => {
			if (timer) clearTimeout(timer);
		};
	});

	return timeLeft;
};
export default Countdown;
