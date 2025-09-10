import { FaGithub,FaLinkedin, FaRegCopyright } from "react-icons/fa";
import './style.css'

const Footer = () => {
    return (
        <div id="footer" className="d-flex justify-content-between align-items-center border-top border-dark m-3">
              <p className="m-0"><FaRegCopyright /> 2025 Romdoul Web Security. All rights reserved.</p>
            <div className="d-flex gap-2">
                <span>Find me on:</span>
                <a href="https://www.linkedin.com/in/chansomethea-taing/" target="_blank"><FaLinkedin size={24}/></a>
                <a href="https://github.com/methea15" target="_blank"> <FaGithub size={24} /></a>
            </div>
        </div>
    )
}

export default Footer
