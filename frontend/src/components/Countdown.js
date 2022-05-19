import { useRouter } from "next/router";
import { default as ReactCountdown } from "react-countdown";

const Countdown = ({ endDateTime, upDatePage }) => {
    const router = useRouter();
    return <ReactCountdown date={endDateTime} onComplete={() => upDatePage()} />;
};

export default Countdown;
