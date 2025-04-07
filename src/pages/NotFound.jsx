import { Link } from "react-router-dom";
import image404 from '../../public/3814348.jpg'
const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
            <div className="w-96 h-96">
                <img src={image404} alt="404 image" />
            </div>
            <p className="text-xl mt-2">Oops! The page you are looking for does not exist.</p>
            <Link to="/dashboard" className="mt-4 px-6 py-2 bg-[#483285] text-white rounded-lg">
                Go Back to Dashboard
            </Link>
        </div>
    );
};

export default NotFound;
