import { FaGithub,FaLinkedin, FaRegCopyright } from "react-icons/fa";
import './style.css'
const Footer = () => {
    return (
        <div id="footer" className="d-flex justify-content-between align-items-center border-top border-dark m-3">
              <p className="m-0"><FaRegCopyright /> 2025 Romdoul Web Security. All rights reserved.</p>
              <p className="m-0">
              Privacy Policy | Terms of Service</p>
            <div className="d-flex gap-3">
                <span>Find me on:</span>              <FaLinkedin size={24} />
                <FaGithub size={24} /></div>
        </div>

  )
}

export default Footer
